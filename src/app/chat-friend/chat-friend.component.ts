import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Friend } from '../model/friend.model';
import { GroupChat } from '../model/groupchat.model';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { matSnackDuration } from '../styles/active-theme-variables';

@Component({
  selector: 'app-chat-friend',
  imports: [CommonModule, MatDividerModule],
  templateUrl: './chat-friend.component.html',
  styleUrl: './chat-friend.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatFriendComponent implements OnDestroy, OnChanges {
  @Input() data!: { friend?: Friend, groupChat?: GroupChat };
  private subscriptions: Subscription = new Subscription();

  public groupChat: GroupChat | undefined;

  constructor(private authService: AuthService, private matSnack: MatSnackBar) { }

  ngOnChanges(): void {
    this.getGroupChat();
  }

  private getGroupChat() {
    if (this.data.groupChat) {
      this.groupChat = {
        ...this.data.groupChat,
        users: this.data.groupChat.users.filter((users) => users.username !== 'user')
      }
    }
  }

  public controlChatSound() {
    let state!: boolean;
    let param!: {friendId: Friend['userId']} | {chatId: GroupChat['chatId']};

    if (this.data.friend) {
      state = this.data.friend.isMuted ? false : true;
      param = { friendId: this.data.friend.userId };

    } else if (this.data.groupChat) {
      state = this.data.groupChat.isMuted ? false : true;
      param = { chatId: this.data.groupChat.chatId }
    }

    const subscription = this.authService.mute(param, state).subscribe({
      error: (error) => {
        this.matSnack.open(error.detail ? error.detail : `Error muting chat, try again later`, 'Dismiss', { duration: matSnackDuration });
      }
    })

    this.subscriptions.add(subscription);
  }

  public clearChat() {
    if (this.data.friend && this.data.friend.messages.length > 0 || this.data.groupChat && this.data.groupChat.messages.length > 0) {
      const target: Friend | GroupChat | undefined = this.data.friend ? this.data.friend : this.data.groupChat;

      if (!target) return;

      const subscription = this.authService.deleteChat(target).subscribe({
        error: (err) => {
          this.matSnack.open(err.detail ? err.detail : `Error clearing chat, try again later`, 'Dismiss', { duration: matSnackDuration });
          console.error(err);
        }
      });

      this.subscriptions.add(subscription);
    }
  }

  public deleteFriend() {
    if (this.data.friend) {
      const subscription = this.authService.deleteFriend(this.data.friend).subscribe({
        next: (res: { message: string }) => {
          this.matSnack.open(res.message, 'Dismiss', { duration: matSnackDuration });
        },

        error: (err) => {
          this.matSnack.open(err.detail ? err.detail : `Error deleting ${this.data.friend?.username}, try again later`, 'Dismiss', { duration: matSnackDuration });
          console.error(err);
        }
      })

      this.subscriptions.add(subscription);
    }
  }

  public leaveChat() {
    if (!this.groupChat?.chatId) return;
    
    this.authService.deleteGroupChatFromUsersChatsList(this.groupChat?.chatId);
    const subscription = this.authService.leaveGroupChat(this.groupChat?.chatId!).subscribe({
      next: () => {
        this.matSnack.open(`You have left the group chat`, 'Dismiss', { duration: matSnackDuration });
      },

      error: (error) => { 
        this.matSnack.open(error.detail ? error.detail : `Error leaving chat, try again later`, 'Dismiss', { duration: matSnackDuration })
      }
    })

    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }
}
