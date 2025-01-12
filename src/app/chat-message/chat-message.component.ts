import { Component, Input } from '@angular/core';
import { Friend } from '../model/friend.model';
import { GroupChat, User } from '../model/user.model';
import { CommonModule } from '@angular/common';
import { UnseenTextsLength } from '../pipes/unseen-texts-length.pipe';
import { ChatDatePipe } from '../pipes/chat-date.pipe';
import { ChatService } from '../services/chat.service';
import { SocketService } from '../services/socket.service';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat-message',
  imports: [CommonModule, UnseenTextsLength, ChatDatePipe, MatButtonModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  @Input() data!: { username: User['username'], friendsList?: Friend[], groupChatList?: GroupChat[], isOnline?: boolean };

  constructor(
    private chatService: ChatService, 
    private socketService: SocketService,
    private authService: AuthService
  ) { }

  public updateLastSelectedFriend(friend: Friend) {
    this.chatService.updateLastSelectedFriend(friend);

    if (friend.messages.length > 0 && friend.messages[friend.messages.length -1].isIncoming) {
      this.socketService.hasSeen(friend.userId);
    } else {
      this.authService.findLastSeenMessageIndex(friend.username);
    }
  }

  public updateLastSelectedGroupChat(groupChat: GroupChat) {
    this.chatService.updateLastSelectedGroupChat(groupChat);
  }
}
