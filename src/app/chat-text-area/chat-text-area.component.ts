import { CommonModule, formatDate, JsonPipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';
import { SocketService } from '../services/socket.service';
import { Friend, FriendMessage, Message } from '../model/friend.model';
import { map, Subscription } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { GroupChat, GroupChatMessage } from '../model/groupchat.model';

@Component({
  selector: 'app-chat-text-area',
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './chat-text-area.component.html',
  styleUrl: './chat-text-area.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ChatTextAreaComponent implements OnInit, OnDestroy {
  @ViewChild('messagesWrapper') messagesWrapper!: ElementRef<HTMLDivElement>;

  private activeSubscriptions: Subscription = new Subscription();

  public chatList!: Message[];
  public friend!: Friend | undefined;
  public groupChat!: GroupChat | undefined;
  public textareaValue: string = '';
  public clickedTextIndex: number | null = null;

  constructor(
    private chatService: ChatService,
    private socketService: SocketService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.fetchFriendChatData();
  }

  private fetchFriendChatData() {
    const subscription = this.chatService.lastSelectedFriend$.subscribe((friend: Friend) => {
      if (friend) {
        this.groupChat = undefined;
        this.friend = friend;
        this.fetchMessages(friend);
        this.scrollToBottomAndEmptyTextareaValue();
      } else {
        this.fetchGroupChatData();
      }
    })

    this.activeSubscriptions.add(subscription);
  }

  private fetchGroupChatData() {
    const subscription = this.chatService.lastSelectedGroupChat$.subscribe((groupChat) => {
      if (groupChat) {
        this.friend = undefined;
        this.groupChat = groupChat;
        this.fetchMessages(groupChat);
        this.scrollToBottomAndEmptyTextareaValue();
      } else {
        this.fetchFriendChatData();
      }
    })

    this.activeSubscriptions.add(subscription);
  }

  private fetchMessages(chat: Friend | GroupChat) {
    let observable;
    if ('userId' in chat) {
      observable = this.authService.user$.pipe(map((user) => user.friendsList.find((friend) => friend.userId === chat.userId)?.messages));
    } else if ('chatId' in chat) {
      observable = this.authService.user$.pipe(map((user) => user.groupChatsList.find((groupChat) => groupChat.chatId === chat.chatId)?.messages));
    }

    const subscription = observable?.subscribe((messages) => {
      if ('chatId' in chat && messages) {
        this.chatList = this.removeUserFromIsSeenByArray(messages);
      } else if (messages) {
        this.chatList = messages;
      }
    })

    this.activeSubscriptions.add(subscription);
  }

  private removeUserFromIsSeenByArray(messages: Message[]): Message[] {
    const newMessages = messages.map((message) => {
      const newMessage = { ...message, isSeenBy: [...message.isSeenBy] };
      newMessage.isSeenBy = newMessage.isSeenBy.filter((user) => user.username !== 'user');
  
      return newMessage;
    });
  
    return newMessages;
  }

  public handleTextSend(event: MouseEvent | KeyboardEvent) {
    if (event instanceof KeyboardEvent && event.code !== 'Enter') {
      return;
    } else {
      event.preventDefault() // prevent Enter key from creating new line when pressed;
    }

    if (this.textareaValue.trim().length === 0) {
      return;
    }

    let message!: FriendMessage | GroupChatMessage

    if (this.friend) {
      message = {
        type: 'friendText',
        friendName: this.friend.username,
        text: this.textareaValue
      }
    } else if (this.groupChat) {
      message = {
        type: 'groupChatText',
        chatId: this.groupChat.chatId,
        text: this.textareaValue,
      }
    }

    if (message) {
      this.socketService.chat(message);
    }

    this.scrollToBottomAndEmptyTextareaValue();
  }

  test(as: any) {
    console.log(as)
  }

  private scrollToBottomAndEmptyTextareaValue() {
    setTimeout(() => {
      this.messagesWrapper.nativeElement.scroll({
        top: this.messagesWrapper.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }, 0);
    this.textareaValue = '';
  }

  shouldShowDateSeparator(currentIndex: number): boolean {
    if (currentIndex === 0) {
      return true;
    }

    const currentMessageDate = this.chatList[currentIndex].timeStamp;
    const previousMessageDate = this.chatList[currentIndex - 1].timeStamp;

    return (formatDate(currentMessageDate, 'yyyy-MM-dd', 'en-US') !== formatDate(previousMessageDate, 'yyyy-MM-dd', 'en-US'));
  }

  getDateSeparator(date: Date): string {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (formatDate(date, 'yyyy-MM-dd', 'en-US') === formatDate(today, 'yyyy-MM-dd', 'en-US')) {
      return 'Today';
    }

    if (formatDate(date, 'yyyy-MM-dd', 'en-US') === formatDate(yesterday, 'yyyy-MM-dd', 'en-US')) {
      return 'Yesterday';
    }

    return formatDate(date, 'MMMM d', 'en-US');
  }

  showTextDeliveryTime(i: number) {
    if (this.clickedTextIndex) {
      this.clickedTextIndex = 0;
    } else {
      this.clickedTextIndex = i + 1;
    }
  }

  trackByMessage(index: number, message: Message): string {
    return message.id;
  }

  ngOnDestroy(): void {
    this.activeSubscriptions?.unsubscribe();
  }
}
