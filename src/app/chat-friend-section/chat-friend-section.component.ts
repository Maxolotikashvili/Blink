import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';
import { combineLatest, map, merge, Observable, Subscription } from 'rxjs';
import { Friend, LastSelectedFriend } from '../model/friend.model';
import { ChatService } from '../services/chat.service';
import { GroupChat, LastSelectedGroupChat } from '../model/groupchat.model';
import { ChatFriendComponent } from "../chat-friend/chat-friend.component";

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

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.getLastSelectedFriendOrGroupChat();
  }

  getLastSelectedFriendOrGroupChat() {
    const subscription = merge(this.chatService.lastSelectedFriend$, this.chatService.lastSelectedGroupChat$).subscribe((data) => {
      if (data && 'userId' in data) {
        this.friend = data;
        this.groupChat = undefined
      } else {
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
