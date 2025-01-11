import { Component, input, Input, OnInit } from '@angular/core';
import { Friend } from '../model/friend.model';
import { GroupChat, User } from '../model/user.model';
import { CommonModule } from '@angular/common';
import { UnseenTextsLength } from '../pipes/unseen-texts-length.pipe';
import { ChatDatePipe } from '../pipes/chat-date.pipe';
import { ChatService } from '../services/chat.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat-message',
  imports: [CommonModule, UnseenTextsLength, ChatDatePipe],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent implements OnInit {
  @Input() data!: {username: User['username'], friendsList?: Friend[], groupChatList?: GroupChat[], isOnline?: boolean};
  
  public friendsList!: Friend[];

  constructor(private chatService: ChatService, private socketService: SocketService) {}

  ngOnInit(): void {
    this.assignProperValueToFriendsList();
  }

  private assignProperValueToFriendsList() {
    if (this.data.friendsList && this.data.isOnline) {
      this.friendsList = this.data.friendsList.filter((friend) => friend.isOnline);
    } else if (this.data.friendsList) {
      this.friendsList = this.data.friendsList;
    }
  }

  public updateLastSelectedFriend(friend: Friend) {
    this.chatService.updateLastSelectedFriend(friend);
    this.socketService.hasSeen(friend.userId);
  }

  public updateLastSelectedGroupChat(groupChat: GroupChat) {
    this.chatService.updateLastSelectedGroupChat(groupChat);
  }
}
