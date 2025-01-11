import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';
import { CommonModule } from '@angular/common';
import { ChatUserSectionComponent } from "../chat-user-section/chat-user-section.component";
import { ChatSidebarComponent } from "../chat-sidebar/chat-sidebar.component";
import { ChatTextAreaComponent } from "../chat-text-area/chat-text-area.component";
import { ChatFriendsSectionComponent } from "../chat-friend-section/chat-friend-section.component";
import { fromEvent, Subscription, take } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';
import { SOCKET_URL } from '../api_url';

@Component({
  selector: 'app-chat-main',
  imports: [CommonModule, MaterialModule, ChatUserSectionComponent, ChatSidebarComponent, ChatTextAreaComponent, ChatFriendsSectionComponent],
  templateUrl: './chat-main.component.html',
  styleUrl: './chat-main.component.scss'
})
export class ChatMainComponent implements OnInit, OnDestroy {
  private token: string | null = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  public isComponentInitialized: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private socketService: SocketService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.connectToConnectSocket();
    this.connectToNotificationSocket();
    this.connectToAcceptFriendReqSocket();
    this.connectToChatSocket();
    this.connectToHasSeenSocket();
    this.connectToCreateGroupChatSocket();
  }

  private getUser() {
    this.authService.getuserInfo().pipe(take(1)).subscribe((user: { user: User }) => {
      this.authService.updateUser(user.user);
      this.isComponentInitialized = true;
    })
  }

  private connectToConnectSocket() {
    const connectSocket: WebSocket = new WebSocket(`${SOCKET_URL}/connect?token=${this.token}`);
    this.socketService.connectSocket = connectSocket;

    const activeSubscription = fromEvent<MessageEvent>(connectSocket, 'message').subscribe((event) => {
      this.authService.updateUserNotifications(JSON.parse(event.data));
    })

    this.subscriptions.add(activeSubscription);
  }

  private connectToNotificationSocket() {    
    const notificationSocket: WebSocket = new WebSocket(`${SOCKET_URL}/add_friend?token=${this.token}`);
    this.socketService.notificationSocket = notificationSocket;

    const activeSubscription = fromEvent<MessageEvent>(notificationSocket, 'message').subscribe((event) => {
      this.authService.updateUserNotifications(JSON.parse(event.data));
    })

    this.subscriptions.add(activeSubscription);
  }

  private connectToAcceptFriendReqSocket() {
    const acceptFriendReqSocket: WebSocket = new WebSocket(`${SOCKET_URL}/accept_friend_request?token=${this.token}`);
    this.socketService.acceptFriendReqSocket = acceptFriendReqSocket;

    const activeSubscription = fromEvent<MessageEvent>(acceptFriendReqSocket, 'message').subscribe((event) => {
      this.authService.updateUserNotifications(JSON.parse(event.data));
    })

    this.subscriptions.add(activeSubscription);
  }

  private connectToChatSocket() {
    const chatSocket: WebSocket = new WebSocket(`${SOCKET_URL}/chat?token=${this.token}`);
    this.socketService.chatSocket = chatSocket;

    const activeSubscription = fromEvent<MessageEvent>(chatSocket, 'message').subscribe((event) => {
      this.authService.updateUserNotifications(JSON.parse(event.data));
    })

    this.subscriptions.add(activeSubscription);
  }

  private connectToHasSeenSocket() {
    const hasSeenSocket: WebSocket = new WebSocket(`${SOCKET_URL}/has_seen?token=${this.token}`);
    this.socketService.hasSeenSocket = hasSeenSocket;

    const activeSubscription = fromEvent<MessageEvent>(hasSeenSocket, 'message').subscribe((event) => {
      this.authService.updateUserNotifications(JSON.parse(event.data));
    })

    this.subscriptions.add(activeSubscription);
  }

  private connectToCreateGroupChatSocket() {
    const createGroupChatsocket: WebSocket = new WebSocket(`${SOCKET_URL}/create-group-chat?token=${this.token}`);
    this.socketService.createGroupChatsocket = createGroupChatsocket;

    const activeSubscription = fromEvent<MessageEvent>(createGroupChatsocket, 'message').subscribe((event) => {
      this.authService.updateUserNotifications(JSON.parse(event.data));
    })

    this.subscriptions.add(activeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }
}
