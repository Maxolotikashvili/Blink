import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';
import { combineLatest, map, merge, Observable, Subscription, switchMap } from 'rxjs';
import { Friend, LastSelectedFriend } from '../model/friend.model';
import { ChatService } from '../services/chat.service';
import { GroupChat, LastSelectedGroupChat } from '../model/groupchat.model';
import { ChatFriendComponent } from "../chat-friend/chat-friend.component";
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-chat-friend-section',
  imports: [CommonModule, MaterialModule, ChatFriendComponent],
  templateUrl: './chat-friend-section.component.html',
  styleUrl: './chat-friend-section.component.scss'
})
export class ChatFriendsSectionComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription = new Subscription();
  public friend!: LastSelectedFriend | undefined;
  public groupChat!: LastSelectedGroupChat | undefined;

  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getLastSelectedFriendOrGroupChat();
  }

  getLastSelectedFriendOrGroupChat() {
    const subscription = merge(this.chatService.lastSelectedFriend$, this.chatService.lastSelectedGroupChat$).pipe(
      switchMap((mergedData: LastSelectedFriend | LastSelectedGroupChat) => {
        if (mergedData) {
          if ('userId' in mergedData) {
            const lastSelectedFriend$: Observable<LastSelectedFriend> = this.authService.user$.pipe(map((user) => {
              const friend = user.friendsList.find((friend) => friend.userId === mergedData.userId)!
              return {
                ...friend,
                messages: undefined,
                messagesLength: friend.messages.length
              }
            }))
            return lastSelectedFriend$;
          } else {
            const lastSelectedGroupChat$: Observable<LastSelectedGroupChat> = this.authService.user$.pipe(map((user) => {
             const groupchat = user.groupChatsList.find((groupChat) => groupChat.chatId === mergedData.chatId)!
              return {
                ...groupchat,
                messages: undefined,
                messagesLength: groupchat.messages.length
              }
            }));
            return lastSelectedGroupChat$;
          }
        }

        return new Observable<void>;
      })
    ).subscribe((data: LastSelectedFriend | LastSelectedGroupChat | void) => {
      if (data && 'userId' in data) {
        this.groupChat = undefined;
        this.friend = data;
      } else if (data && 'chatId' in data) {
        this.groupChat = data;
        this.friend = undefined;
      }
    })

    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
