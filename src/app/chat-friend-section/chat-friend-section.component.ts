import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';
import { Observable } from 'rxjs';
import { Friend } from '../model/friend.model';
import { ChatService } from '../services/chat.service';
import { GroupChat } from '../model/groupchat.model';
import { ChatFriendComponent } from "../chat-friend/chat-friend.component";

@Component({
  selector: 'app-chat-friend-section',
  imports: [CommonModule, MaterialModule, ChatFriendComponent],
  templateUrl: './chat-friend-section.component.html',
  styleUrl: './chat-friend-section.component.scss'
})
export class ChatFriendsSectionComponent implements OnInit {
  friend$!: Observable<Friend>;
  groupChat$!: Observable<GroupChat>;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.getFriendData();
    this.getGroupChat();
  }

  private getFriendData() {
    this.friend$ = this.chatService.lastSelectedFriend$;
  }

  private getGroupChat() {
    this.groupChat$ = this.chatService.lastSelectedGroupChat$;
  }
}
