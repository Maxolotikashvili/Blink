import { Component, Input } from '@angular/core';
import { Friend, Message } from '../model/friend.model';
import { GroupChat, GroupChatUser, LastSelectedGroupChat } from '../model/groupchat.model';
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

  public updateLastSelectedFriend(friendId: Friend['userId']) {
    const selectedFriend: Friend = this.data.friendsList?.find((friend) => friend.userId === friendId)!;
    const lastMessage: Message = selectedFriend?.messages[selectedFriend.messages.length -1];
    
    this.selectedChat = friendId;

    if (!selectedFriend) return;

    const {messages, ...resOfFriend} = selectedFriend;
    const lastSelectedFriend = {
      ...resOfFriend,
      messagesLength: selectedFriend.messages.length      
    }

    this.chatService.updateLastSelectedFriend(lastSelectedFriend);
    const shouldShowSeen = selectedFriend.messages.length > 0 && lastMessage.isIncoming;

    if (shouldShowSeen) {
      this.socketService.hasSeen({id: selectedFriend.userId, type: 'friend'});
    } 
  }

  public updateLastSelectedGroupChat(groupChatId: GroupChat['chatId']) {
    const selectedChat: GroupChat = this.data.groupChatList?.find((groupChat) => groupChat.chatId === groupChatId)!;
    const lastMessage: Message = selectedChat?.messages[selectedChat.messages.length -1];
    
    this.selectedChat = selectedChat.chatId;

    if (!selectedChat) return;

    const {messages, ...resOfGroupChat} = selectedChat;
    const lastSelectedGroupChat: LastSelectedGroupChat = {
      ...resOfGroupChat,
      messagesLength: messages.length
    }
    
    this.chatService.updateLastSelectedGroupChat(lastSelectedGroupChat);

    const isMessageIncoming: boolean = selectedChat.messages.length > 0 && lastMessage.isIncoming;
    const isAlreadySeen: boolean = lastMessage.isSeenBy.length > 0 && lastMessage.isSeenBy.some((user) => user.username === 'user');

    if (isMessageIncoming && !isAlreadySeen) {
      this.socketService.hasSeen({id: selectedChat.chatId, type: 'groupchat'});
    }
  }
}
