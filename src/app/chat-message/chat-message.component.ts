import { Component, Input } from '@angular/core';
import { Friend } from '../model/friend.model';
import { GroupChat, GroupChatUser } from '../model/groupchat.model';
import { CommonModule } from '@angular/common';
import { ChatDatePipe } from '../pipes/chat-date.pipe';
import { ChatService } from '../services/chat.service';
import { SocketService } from '../services/socket.service';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../model/user.model';
import { UnseenTextsLengthPipe } from '../pipes/unseen-texts-length.pipe';
import { UnseenGroupTextsLength } from '../pipes/unseen-grouptexts-length.pipe';

@Component({
  selector: 'app-chat-message',
  imports: [CommonModule, ChatDatePipe, MatButtonModule, UnseenTextsLengthPipe, UnseenGroupTextsLength],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  @Input() data!: { username: User['username'], friendsList?: Friend[], groupChatList?: GroupChat[], isOnline?: boolean };
  public selectedChat!: Friend['userId'] | GroupChat['chatId']; 
  
  constructor(
    private chatService: ChatService, 
    private socketService: SocketService,
  ) {
  }

  public updateLastSelectedFriend(friend: Friend) {
    this.selectedChat = friend.userId;

    this.chatService.updateLastSelectedFriend(friend);
    const shouldShowSeen = friend.messages.length > 0 && friend.messages[friend.messages.length - 1].isIncoming;

    if (shouldShowSeen) {
      this.socketService.hasSeen({id: friend.userId, type: 'friend'});
    } 
  }

  public updateLastSelectedGroupChat(groupChat: GroupChat) {
    this.selectedChat = groupChat.chatId;

    this.chatService.updateLastSelectedGroupChat(groupChat);

    const isMessageIncoming = groupChat.messages.length > 0 && groupChat.messages[groupChat.messages.length -1].isIncoming;
    const isAlreadySeen = groupChat.messages[groupChat.messages.length -1].isSeenBy.length > 0 && groupChat.messages[groupChat.messages.length -1].isSeenBy.some((user) => user.username === 'user');

    if (isMessageIncoming && !isAlreadySeen) {
      this.socketService.hasSeen({id: groupChat.chatId, type: 'groupchat'});
    }
  }
}
