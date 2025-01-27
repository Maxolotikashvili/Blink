import { Injectable } from "@angular/core";
import { API_URL } from '../api_url';
import { LoginResponse, UserLogin, UserRegister } from "../model/auth.model";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, finalize, Observable, Subscription, switchMap, tap } from "rxjs";
import { Notification } from "../model/notification.model";
import { SocketService } from "./socket.service";
import { User } from "../model/user.model";
import { GroupChat, LastSelectedGroupChat } from "../model/groupchat.model";
import { Friend, LastSelectedFriend, Message } from "../model/friend.model";
import { SoundService } from "./sound.service";
import { ChatService } from "./chat.service";
import { ModalService } from "./modal.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { matSnackDuration } from "../styles/active-theme-variables";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private initialUserValue: User = {
        userId: '',
        username: '',
        bio: '',
        email: '', friendsList: [],
        avatar: '',
        notifications: [],
        groupChatsList: [],
        theme: 'chronoflux',
    }
    private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(this.initialUserValue);
    readonly user$: Observable<User> = this.userSubject as Observable<User>;

    private subscription: Subscription = new Subscription();
    private lastSelectedFriend!: LastSelectedFriend | null;
    private lastSelectedGroupChat!: LastSelectedGroupChat | null;

    constructor(
        private http: HttpClient,
        private socketService: SocketService,
        private soundService: SoundService,
        private chatService: ChatService,
        private modalService: ModalService,
        private matSnack: MatSnackBar
    ) {

        this.getLastSelectedFriendOrGroupChat();
    }

    private getLastSelectedFriendOrGroupChat() {
        const subscription = this.chatService.lastSelectedFriend$.pipe(
            switchMap((friend) => {
                if (friend) {
                    this.lastSelectedFriend = friend;
                    this.lastSelectedGroupChat = null
                }
                return this.chatService.lastSelectedGroupChat$
            })
        ).subscribe((groupChat) => {
            if (groupChat) {
                this.lastSelectedGroupChat = groupChat;
                this.lastSelectedFriend = null;
            }
        })

        this.subscription.add(subscription);
    }

    public getuserInfo() {
        return this.http.get<{ user: User }>(`${API_URL}/users/user_info`);
    }

    public registerUser(user: UserRegister) {
        return this.http.post(`${API_URL}/users/register`, user);
    }

    public loginUser(user: UserLogin) {
        return this.http.post<LoginResponse>(`${API_URL}/users/login`, user);
    }

    public updateUser(user: User) {
        this.userSubject.next({ ...user });
    }

    public deleteNotification(id: Notification['id']): Observable<{ message: string }> {
        const currentUser = this.userSubject.value;
        const updatedNotifications = currentUser.notifications.filter(
            (notification) => notification.id !== id
        );
        this.userSubject.next({ ...currentUser, notifications: updatedNotifications });
        return this.http.delete<{ message: string }>(`${API_URL}/users/delete_notification?id=${id}`);
    }

    public markAllNotificationsAsSeen() {
        return this.http.put(`${API_URL}/users/mark_all_notifications_seen`, {});
    }

    public updateNotificationsAfterSeing() {
        const currentUser = this.userSubject.value;
        currentUser.notifications.forEach((notification) => { notification.isSeenByUser = true });
        this.updateUser(currentUser);
    }

    public mute(id: { friendId: Friend['userId'] } | { chatId: GroupChat['chatId'] }, state: boolean) {
        const currentUser = this.userSubject.value;
        const urlParams = {
            endpoint: 'friendId' in id ? 'mute_friend_chat' : 'mute_groupchat',
            param: 'friendId' in id ? { friend_id: id.friendId } : { chat_id: id.chatId }
        }

        if ('friendId' in id) {
            const friend = currentUser.friendsList.find((friend) => friend.userId === id.friendId);
            if (friend) {
                friend.isMuted = state;
            }
        }
        else if ('chatId' in id) {
            const groupChat = currentUser.groupChatsList.find((groupChat) => groupChat.chatId === id.chatId);
            if (groupChat) {
                groupChat.isMuted = state;
            }
        }
        this.userSubject.next({ ...currentUser });

        return this.http.patch<{ message: string }>(`${API_URL}/users/${urlParams.endpoint}`, { ...urlParams.param, is_muted: state });
    }

    public leaveGroupChat(chatId: GroupChat['chatId']) {
        return this.http.delete<{ message: string }>(`${API_URL}/users/leave_groupchat?chat_id=${chatId}`);
    }

    public deleteGroupChatFromUsersChatsList(chatId: GroupChat['chatId']) {
        const currentUser = this.userSubject.value;

        if (currentUser.groupChatsList.length === 0) {
            return
        }
        const targetGroupChat: GroupChat | undefined = currentUser.groupChatsList.find((groupChat) => groupChat.chatId === chatId);
        if (targetGroupChat) {
            currentUser.groupChatsList.splice(currentUser.groupChatsList.indexOf(targetGroupChat), 1)
            this.chatService.updateLastSelectedGroupChat('');
        } else {
            return;
        }

        this.updateUser(currentUser);
    }

    public deleteFriend(friend: LastSelectedFriend): Observable<{ message: string }> {
        const currentUser = this.userSubject.value;
        currentUser.friendsList = currentUser.friendsList.filter((friends) => friends.userId !== friend.userId);
        this.chatService.updateLastSelectedFriend('');

        this.userSubject.next({ ...currentUser });
        return this.http.delete<{ message: string }>(`${API_URL}/users/delete_friend?friendId=${friend.userId}`);
    }

    public deleteChat(param: LastSelectedFriend | LastSelectedGroupChat): Observable<{ message: string }> {
        const currentUser = this.userSubject.value;
        const url: string = 'userId' in param ? `delete_chat?friendId=${param.userId}` : `delete-group-chat?chatId=${param.chatId}`;
        let target: Friend | GroupChat | undefined;

        if ('userId' in param) {
            target = currentUser.friendsList.find((friend) => friend.userId === param.userId);
            currentUser.friendsList[currentUser.friendsList.indexOf(target!)].messages = [];

        } else if ('chatId' in param) {
            target = currentUser.groupChatsList.find((groupChat) => groupChat.chatId === param.chatId);
            currentUser.groupChatsList[currentUser.groupChatsList.indexOf(target!)].messages = [];
        }

        this.userSubject.next({ ...currentUser });
        return this.http.delete<{ message: string }>(`${API_URL}/users/${url}`);
    }

    public updateUserNotifications(notification: Notification) {
        const currentUser: User = this.userSubject.value;
        console.log(notification);

        if (currentUser.userId && notification.type === 'connection') {
            if (currentUser.friendsList) {
                const friend = currentUser.friendsList.find((friend) => friend.username === notification.friendName);
                if (friend && friend.isOnline !== undefined && notification.isOnline !== undefined) {
                    friend.isOnline = notification.isOnline;
                }
                this.userSubject.next({ ...currentUser });
            }
        }

        if (notification.type === 'friend-request') {
            const isSenderOutgoingRequest: boolean = !notification.isIncoming && notification.sender.userId === currentUser.userId;
            const isSenderIncomingRequest: boolean = notification.isIncoming && notification.receiver.userId === currentUser.userId;
            const removablePendingRecipientNotification: Notification | undefined = currentUser.notifications.find((element) => element.notificationId === notification.notificationId && element.receiver.userId === currentUser.userId && notification.receiver.userId !== currentUser.userId && element.status === 'pending' && notification.status === 'complete')

            if (isSenderOutgoingRequest) {
                currentUser.notifications.push(notification);
            }

            if (isSenderIncomingRequest) {
                currentUser.notifications.push(notification);
                this.soundService.playIncomingNotificationSound();
            }

            // friend request recipient accepted
            if (removablePendingRecipientNotification) {
                currentUser.notifications.splice(currentUser.notifications.indexOf(removablePendingRecipientNotification), 1);
                const newFriend: Friend | undefined = currentUser.friendsList.find((friend) => friend.userId === notification.newFriend?.userId)
                if (!newFriend && notification.newFriend) {
                    currentUser.friendsList.push(notification.newFriend);
                    this.soundService.playAcceptFriendRequestSound();
                }
            }

            // friend request sender accepted
            if (notification.status === 'complete' && isSenderIncomingRequest) {

                const newFriend: Friend | undefined = currentUser.friendsList.find((friend) => friend.userId === notification.newFriend?.userId)
                if (!newFriend && notification.newFriend) {
                    currentUser.friendsList.push(notification.newFriend);
                }
            }

            if (notification.status === 'rejected') {
                currentUser.notifications = currentUser.notifications.filter((notifications) => notifications.notificationId !== notification.notificationId);
            }

            this.userSubject.next(currentUser);
        }

        if (notification.message && typeof notification.message !== 'string') {
            if (notification.type === 'message' && !notification.message?.lastSeen) {
                currentUser.friendsList.find((friend) => friend.username === notification.friendName)?.messages.push(notification.message as Message);
                const isFriendMuted = currentUser.friendsList.find((friend) => friend.username === notification.friendName)?.isMuted;

                const message: Message = notification.message as Message;
                if (message.sender === 'user') {
                    this.soundService.playMessageSentSound();
                } else if (message.sender !== 'user' && !isFriendMuted) {
                    this.soundService.playIncomingMessageSound();
                }

                this.userSubject.next({ ...currentUser });
            }

            if (notification.type === 'groupMessage') {
                const groupChat = currentUser.groupChatsList.find((groupChats) => groupChats.chatId === notification.chatId);

                if (notification.message.sender === 'user') {
                    this.soundService.playMessageSentSound();
                } else if (notification.message.sender !== 'user' && !groupChat?.isMuted) {
                    this.soundService.playIncomingMessageSound();
                }
            }

            if (this.lastSelectedFriend && notification.message.sender === this.lastSelectedFriend.username) {
                this.socketService.hasSeen({ id: this.lastSelectedFriend.userId, type: 'friend' });
            } else if (this.lastSelectedGroupChat && this.lastSelectedGroupChat.users.some((user) => {
                if (typeof notification.message !== 'string' && notification.message?.sender === user.username) return 1; else return 0;
            })) {
                this.socketService.hasSeen({ id: this.lastSelectedGroupChat.chatId, type: 'groupchat' });
            }
        }

        if (notification.type === 'hasSeen') {
            this.handleHasSeenState(notification);
        }
        if (notification.type === 'groupSeen') {
            this.updateHasSeenStateForGroupChat(notification);
        }

        if (notification.message && notification.type !== 'message' && notification.type !== 'groupMessage') {
            this.socketService.handleResponseMessages(notification.message as string);
            this.socketService.updateSocketLoadingState(false);
        }

        if (notification.type === "group-chat-create") {
            currentUser.groupChatsList.push(notification as any);
            this.userSubject.next(currentUser);

            if (notification.message) {
                this.matSnack.open(notification.message as string, 'Dismiss', { duration: matSnackDuration });
            } else {
                this.socketService.updateSocketLoadingState(false);
                this.modalService.closeAllPages();
                this.matSnack.open('Group chat created', 'Dismiss', { duration: matSnackDuration });
            }
        }

        if (notification.type === 'groupMessage') {
            const groupChat = currentUser.groupChatsList.find((groupChat) => groupChat.chatId === notification.chatId);
            if (notification.message && typeof notification.message !== 'string') {
                groupChat?.messages.push(notification.message);
            }

            this.userSubject.next(currentUser);
        }
    }

    private handleHasSeenState(notification: Notification) {
        if (!notification.friendName) return;
        if (typeof notification.lastSeen !== 'undefined') {
            this.updateHasSeenState(notification.friendName);
        }
    }

    public updateHasSeenState(friendName: Friend['username']) {
        const currentUser = this.userSubject.value;
        const friend = currentUser.friendsList.find((friend) => friend.username === friendName);

        if (!friend) return;

        friend.messages.map((message) => message.isSeen = true);
        const reversedMessagesList = [...friend.messages].reverse();
        const lastOutgoingMessage = reversedMessagesList.find((message) => !message.isIncoming);
        if (lastOutgoingMessage) {
            friend.messages.map((message) => message.lastSeen = false);
            friend.messages[friend.messages.indexOf(lastOutgoingMessage)].lastSeen = true;
        }

        this.userSubject.next({ ...currentUser });
    }

    private updateHasSeenStateForGroupChat(notification: Notification) {
        if (notification.error) {
            return;
        }
        const currentUser = this.userSubject.value;
        const groupChat: GroupChat = currentUser.groupChatsList.find((groupchat) => groupchat.chatId === notification.chatId)!;
        groupChat.messages = notification.messages!;

        this.userSubject.next({ ...currentUser });
    }
}