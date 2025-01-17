import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Friend } from '../model/friend.model';
import { GroupChat } from '../model/groupchat.model';
import { CommonModule } from '@angular/common';
import { ChatDatePipe } from '../pipes/chat-date.pipe';
import { ChatService } from '../services/chat.service';
import { SocketService } from '../services/socket.service';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';
import { UnseenTextsLengthPipe } from '../pipes/unseen-texts-length.pipe';

@Component({
  selector: 'app-chat-message',
  imports: [CommonModule, ChatDatePipe, MatButtonModule, UnseenTextsLengthPipe],
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

    const shouldShowSeen = friend.messages.length > 0 && friend.messages[friend.messages.length - 1].isIncoming;

    if (shouldShowSeen) {
      this.socketService.hasSeen({id: friend.userId, type: 'friend'});
    } 
    
    this.authService.updateHasSeenState(friend.username);
  }

  public updateLastSelectedGroupChat(groupChat: GroupChat) {
    this.chatService.updateLastSelectedGroupChat(groupChat);

    const shouldShowSeen = groupChat.messages.length > 0 && groupChat.messages[groupChat.messages.length -1].isIncoming;

    if (shouldShowSeen) {
      this.socketService.hasSeen({id: groupChat.chatId, type: 'groupchat'});
    }
  }
}
