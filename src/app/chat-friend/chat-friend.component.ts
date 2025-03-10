import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Friend, LastSelectedFriend } from '../model/friend.model';
import { GroupChat, LastSelectedGroupChat } from '../model/groupchat.model';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../services/auth.service';
import { map, Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { matSnackDuration } from '../styles/active-theme-variables';
import { User } from '../model/user.model';
import { ModalService } from '../services/modal.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ConfirmModalService } from '../services/confirm-modal.service';

@Component({
  selector: 'app-chat-friend',
  imports: [CommonModule, MatDividerModule],
  templateUrl: './chat-friend.component.html',
  styleUrl: './chat-friend.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatFriendComponent implements OnDestroy, OnChanges {
  @Input() data!: { friend?: LastSelectedFriend, groupChat?: LastSelectedGroupChat };
  private subscriptions: Subscription = new Subscription();
  public groupChat: LastSelectedGroupChat | undefined;
  public userId!: Observable<User['userId']>;

  constructor(
    private authService: AuthService,
    private matSnack: MatSnackBar,
    private confirmModalService: ConfirmModalService,
    private modalService: ModalService
  ) { }

  ngOnChanges(): void {
    this.removeUserFromGroupChatUsers();
  }

  private removeUserFromGroupChatUsers() {
    if (this.data.groupChat) {
      this.groupChat = {
        ...this.data.groupChat,
        users: this.data.groupChat.users.filter((users) => users.username !== 'user')
      }
    }
  }

  public controlChatSound() {
    let state!: boolean;
    let param!: { friendId: Friend['userId'] } | { chatId: GroupChat['chatId'] };

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
    if (this.data.friend && this.data.friend.messagesLength > 0 || this.data.groupChat && this.data.groupChat.messagesLength > 0) {
      const target: LastSelectedFriend | LastSelectedGroupChat | undefined = this.data.friend ? this.data.friend : this.data.groupChat;

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
      this.confirmModalService.data = {
        action: 'delete',
        lastSelectedFriend: this.data.friend
      }

      this.modalService.openModal(ConfirmModalComponent);
    }
  }

  public leaveGroupChat() {
    if (!this.groupChat?.chatId) return;

    const subscription = this.authService.leaveGroupChat(this.groupChat?.chatId!).subscribe({
      next: () => {
        this.authService.deleteGroupChatFromUsersChatsList(this.groupChat?.chatId!);
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
