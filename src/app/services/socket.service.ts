import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { matSnackDuration } from '../styles/active-theme-variables';
import { Friend } from '../model/friend.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroupChatMessage } from '../model/groupchat.model';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public connectSocket!: WebSocket;
  public notificationSocket!: WebSocket;
  public acceptFriendReqSocket!: WebSocket;
  public chatSocket!: WebSocket;
  public hasSeenSocket!: WebSocket;
  public createGroupChatsocket!: WebSocket;

  private isSocketLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isSocketLoading$: Observable<boolean> = this.isSocketLoadingSubject as Observable<boolean>;

  constructor(private matSnack: MatSnackBar) { }

  public connect(state: 'connect' | 'disconnect') {
    if (this.connectSocket.OPEN === this.connectSocket.readyState) {
      this.connectSocket.send(state);
    }
  }

  public addFriend(inputValue: string) {
    this.updateSocketLoadingState(true);
    if (this.notificationSocket.OPEN === this.notificationSocket.readyState) {
      this.notificationSocket.send(JSON.stringify({inputValue: inputValue, localizedTime: new Date()}));
    }
  }

  public acceptFriendRequest(senderEmail: string, isAccepted: boolean) {
    this.updateSocketLoadingState(true);
    const data = {
      senderEmail: senderEmail,
      isAccepted: isAccepted,
      localizedTime: new Date()
    }
    if (this.acceptFriendReqSocket.OPEN === this.acceptFriendReqSocket.readyState) {
      this.acceptFriendReqSocket.send(JSON.stringify(data));
    }
  }

  public chat(data: { friendName: Friend['username'], text: string } | GroupChatMessage) {
    if (this.chatSocket.OPEN === this.chatSocket.readyState) {
      this.chatSocket.send(JSON.stringify({...data, localizedTime: new Date()}));
    }
  }

  public hasSeen(param: {id: Friend['userId'], type: 'groupchat' | 'friend'}) {
    if (this.hasSeenSocket.OPEN === this.hasSeenSocket.readyState) {
      let message;
      if (param.type === 'friend') {
        message = {
          friend_id: param.id
        }
      } else {
        message = {
          chat_id: param.id,
        }
      }
      this.hasSeenSocket.send(JSON.stringify(message));
    }
  }

  public createGroupChat(selectedFriendsList: Friend['username'][]) {
    this.updateSocketLoadingState(true);
    if (this.createGroupChatsocket.OPEN === this.createGroupChatsocket.readyState) {
      this.createGroupChatsocket.send(JSON.stringify(selectedFriendsList));
    }
  }

  public handleResponseMessages(message: string) {
    if (message) {
      this.matSnack.open(message, 'Dismiss', { duration: matSnackDuration });
    }
  }

  public updateSocketLoadingState(state: boolean) {
    this.isSocketLoadingSubject.next(state);
  }

  public disconnectFromAllSockets() {
    this.connectSocket.close();
    this.notificationSocket.close();
    this.acceptFriendReqSocket.close();
    this.chatSocket.close();
    this.hasSeenSocket.close();
    this.createGroupChatsocket.close();
  }
}