import { Injectable } from "@angular/core";
import { API_URL } from '../api_url';
import { LoginResponse, UserLogin, UserRegister } from "../model/auth.model";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, find, last, Observable } from "rxjs";
import { Notification } from "../model/notification.model";
import { SocketService } from "./socket.service";
import { GroupChat, User } from "../model/user.model";
import { Friend, Message } from "../model/friend.model";
import { SoundService } from "./sound.service";
import { ChatService } from "./chat.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private initialUserValue: User = {
        userId: '',
        username: '',
        email: '', friendsList: [],
        avatar: '',
        notifications: [],
        groupChatsList: [],
        theme: 'synthwave',
    }
    private lastSelectedFriend!: Friend;
    private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(this.initialUserValue);
    readonly user$: Observable<User> = this.userSubject as Observable<User>;

    private lastSeenMessageIndexSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    public lastseenMessageIndex$: Observable<number> = this.lastSeenMessageIndexSubject as Observable<number>;

    constructor(
        private http: HttpClient,
        private socketService: SocketService,
        private soundService: SoundService,
        private chatService: ChatService
    ) {
        chatService.lastSelectedFriend$.subscribe((friend) => {
            this.lastSelectedFriend = friend;
        })
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
        this.userSubject.next(user);
    }

    public deleteNotification(notificationId: Notification['notificationId']) {
        const currentUser = this.userSubject.value;
        const updatedNotifications = currentUser.notifications.filter(
            (notification) => notification.notificationId !== notificationId
        );
        this.userSubject.next({ ...currentUser, notifications: updatedNotifications });
        return this.http.delete<{ message: string }>(`${API_URL}/users/delete_notification?notification_id=${notificationId}`);
    }

    public muteFriend(friendId: Friend['userId'], state: boolean) {
        const currentUser = this.userSubject.value;
        currentUser.friendsList.map((friend) => {
            if (friend.userId === friendId) {
                friend.isMuted = state;
            }

            return friend;
        })
        this.userSubject.next({ ...currentUser });

        return this.http.patch<{ message: string }>(`${API_URL}/users/mute_friend`, { friend_id: friendId, is_muted: state });
    }

    public deleteFriend(friend: Friend): Observable<{ message: string }> {
        const currentUser = this.userSubject.value;
        currentUser.friendsList.splice(currentUser.friendsList.indexOf(friend), 1);
        this.chatService.updateLastSelectedFriend('');

        this.userSubject.next({ ...currentUser });
        return this.http.delete<{ message: string }>(`${API_URL}/users/delete_friend?friendId=${friend.userId}`);
    }

    public deleteChat(friend: Friend): Observable<{ message: string }> {
        const currentUser = this.userSubject.value;

        const friendIndex = currentUser.friendsList.indexOf(friend);
        currentUser.friendsList[friendIndex].messages = [];

        this.userSubject.next({ ...currentUser });
        return this.http.delete<{ message: string }>(`${API_URL}/users/delete_chat?friendId=${friend.userId}`);
    }

    public deleteGroupChat(groupChat: GroupChat) {
        const currentUser = this.userSubject.value;

        const groupChatIndex = currentUser.groupChatsList.indexOf(groupChat);
        currentUser.groupChatsList[groupChatIndex].messages = [];

        this.userSubject.next({ ...currentUser });
        return this.http.delete<{ message: string }>(`${API_URL}/users/delete_chat?groupChatId=${groupChat.chatId}`);
    }

    public updateLastSeenMessageIndex(lastSeenMessage: number) {
        this.lastSeenMessageIndexSubject.next(lastSeenMessage + 1);
    }

    public updateUserNotifications(notification: Notification) {
        const currentUser: User = this.userSubject.value;
        console.log(notification)

        if (currentUser.userId && notification.type === 'connection') {
            currentUser.friendsList.find((friend) => friend.username === notification.friendName)!.isOnline = notification.isOnline!;
            this.userSubject.next({ ...currentUser });
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
                const matchingNotifications: Notification[] = currentUser.notifications.filter((element) => element.notificationId === notification.notificationId);
                currentUser.notifications = matchingNotifications.filter((item) => item.status !== 'pending');

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
            if (notification.type === 'message' && !notification.message?.isSeen) {

                currentUser.friendsList.find((friend) => friend.username === notification.friendName)?.messages.push(notification.message as Message);
                const isFriendMuted = currentUser.friendsList.find((friend) => friend.username === notification.friendName)?.isMuted;

                const message: Message = notification.message as Message;
                if (message.sender === currentUser.username) {
                    this.soundService.playMessageSentSound();
                } else if (message.sender !== currentUser.username && !isFriendMuted) {
                    this.soundService.playIncomingMessageSound();
                }

                this.userSubject.next({ ...currentUser });
            }
            if (this.lastSelectedFriend && notification.message.sender === this.lastSelectedFriend.username) {
                this.socketService.hasSeen(this.lastSelectedFriend.userId);
            }
        }
        if (notification.type === 'hasSeen' || notification.error) {
            this.updateHasSeenState(notification);
        }

        if (notification.message && notification.type !== 'message') {
            this.socketService.handleResponseMessages(notification.message as string);
            this.socketService.updateSocketLoadingState(false);
        }

        if (notification.type === "group-chat-create") {
            currentUser.groupChatsList.push(notification as any);
            this.userSubject.next(currentUser);
        }
    }

    private updateHasSeenState(notification: Notification) {
        if (notification.error) {
            this.findLastSeenMessageIndex(notification.friendName!);
            return;
        }

        const currentUser = this.userSubject.value;

        const friend = currentUser.friendsList.find(
            (friend) => friend.username === notification.friendName
        );

        if (!friend) {
            console.error("Friend not found for hasSeen notification");
            return;
        }

        friend.messages.forEach((message) => {
            message.isSeen = notification.isSeen!;
        });
        this.findLastSeenMessageIndex(notification.friendName!);
        this.userSubject.next({ ...currentUser });
    }

    private findLastSeenMessageIndex(friendsName: Friend['username']) {
        if (!friendsName) return;

        const currentUser = this.userSubject.value;
        const messages: Message[] = currentUser.friendsList.find((friend) => friend.username === friendsName)?.messages!;

        const reversedChatList = [...messages].reverse();
        const lastSeenMessage: Message = reversedChatList?.find((message) => !message.isIncoming && message.isSeen)!;
        const lastseenMessageIndex = messages.indexOf(lastSeenMessage);
        this.updateLastSeenMessageIndex(lastseenMessageIndex);
    }
}