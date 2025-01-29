import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';
import { SocketService } from '../services/socket.service';
import { FriendMessage, LastSelectedFriend, Message } from '../model/friend.model';
import { map, merge, Observable, of, Subscription, switchMap } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { GroupChatMessage, LastSelectedGroupChat } from '../model/groupchat.model';
import { Theme, ThemeService } from '../services/theme.service';

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
  public friend!: LastSelectedFriend | undefined;
  public groupChat!: LastSelectedGroupChat | undefined;
  public textareaValue: string = '';
  public clickedTextIndex: number | null = null;
  public activeTheme!: Theme;

  constructor(
    private chatService: ChatService,
    private socketService: SocketService,
    private authService: AuthService,
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getActiveTheme();
    this.getLastSelectedChat();
  }

  private getActiveTheme() {
    const subscription = this.themeService.activeTheme$.subscribe((theme) => {
      this.activeTheme = theme;
    });

    this.activeSubscriptions.add(subscription);
  }

  private getLastSelectedChat() {
    const mergedObservables = merge(
      this.chatService.lastSelectedFriend$, 
      this.chatService.lastSelectedGroupChat$
    ).pipe(
      map((mergedData) => {
        if (!mergedData) {
          return '' as const; 
        }
        return mergedData;
      })
    );
    
    const subscription = mergedObservables.subscribe((lastSelectedChat: LastSelectedFriend | LastSelectedGroupChat | '') => {
      if (lastSelectedChat === '') {
        this.friend = undefined;
        this.groupChat = undefined;
        this.chatList = [];
        return;
      }
  
      if (lastSelectedChat) {
        if (
          ('chatId' in lastSelectedChat && lastSelectedChat.chatId === this.groupChat?.chatId) || 
          ('userId' in lastSelectedChat && lastSelectedChat.userId === this.friend?.userId)
        ) {
          return;
        }
    
        if ('chatId' in lastSelectedChat) {
          this.groupChat = lastSelectedChat;
          this.friend = undefined;
        } else if ('userId' in lastSelectedChat) {
          this.friend = lastSelectedChat;
          this.groupChat = undefined;
        }
    
        this.fetchMessages(lastSelectedChat);
      }
    });
    
    this.activeSubscriptions.add(subscription);
  }

  private fetchMessages(chat: LastSelectedFriend | LastSelectedGroupChat) {
    let observable: Observable<Message[] | undefined>;

    if ('chatId' in chat) {
      observable = this.authService.user$.pipe(map((user) => user.groupChatsList.find((groupChat) => groupChat.chatId === chat.chatId)?.messages));
    } else {
      observable = this.authService.user$.pipe(map((user) => user.friendsList.find((friend) => friend.userId === chat.userId)?.messages));
    }

    const subscription = observable.subscribe((messages: Message[] | undefined) => {
      if ('chatId' in chat && messages) {
        this.chatList = this.removeUserFromIsSeenByArray(messages);
      } else if (messages) {
        this.chatList = messages;
      }

      this.scrollToBottomUponReceivingMessage();
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
      this.textareaValue = ''
    }

    this.scrollToBottomUponReceivingMessage();
  }

  private scrollToBottomUponReceivingMessage() {
    setTimeout(() => {
      this.messagesWrapper.nativeElement.scroll({
        top: this.messagesWrapper.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }, 100);
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
