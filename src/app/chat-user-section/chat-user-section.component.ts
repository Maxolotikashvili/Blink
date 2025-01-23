import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';
import { CommonModule } from '@angular/common';
import { Theme, ThemeService } from '../services/theme.service';
import { User } from '../model/user.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { matSnackDuration } from '../styles/active-theme-variables';
import { ModalService } from '../services/modal.service';
import { AddFriendModalComponent } from '../add-friend-modal/add-friend-modal.component';
import { AuthService } from '../services/auth.service';
import { SocketService } from '../services/socket.service';
import { ChatMessageComponent } from "../chat-message/chat-message.component";
import { GroupChatModalComponent } from '../group-chat-modal/group-chat-modal.component';
import { Friend } from '../model/friend.model';
import { AvatarService } from '../services/avatar.service';

@Component({
  selector: 'app-chat-user-section',
  imports: [CommonModule, MaterialModule, ChatMessageComponent],
  templateUrl: './chat-user-section.component.html',
  styleUrl: './chat-user-section.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ChatUserSectionComponent implements OnInit, OnDestroy {
  public user!: User;
  private subscriptions: Subscription = new Subscription();
  public onlineFriendsList: Friend[] = [];
  public avatarsList: string[] = [];

  test(a: any) {
    console.log(a, 'template')
  }

  themeNameList: { displayName: string, key: Theme, background: string }[] = [
    { displayName: 'Synth', key: 'synthwave', background: 'var(--synthwave-button-background-color)' },
    { displayName: 'Forest', key: 'forest', background: 'var(--darkmode-wallpaper-color)' },
    { displayName: 'Kyanite', key: 'kyanite', background: 'var(--darkmode-wallpaper-color)' },
    { displayName: 'Dark', key: 'darkmode', background: 'var(--darkmode-wallpaper-color)' },
    { displayName: 'Light', key: 'lightmode', background: 'var(--darkmode-wallpaper-color)' }
  ];

  constructor(
    private themeService: ThemeService,
    private modalService: ModalService,
    private authService: AuthService,
    private socketService: SocketService,
    private matSnack: MatSnackBar,
    private avatarService: AvatarService
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.applyDefaultThemeOnStart();
    this.getOnlineFriendsList();
    this.avatarsList = this.avatarService.avatarsList;
  }
  
  private getUser() {
    const subscription = this.authService.user$.subscribe((user: User) => {
      this.user = user;
      
      this.filterOnlineFriends();
    });

    this.subscriptions.add(subscription);
  }

  private filterOnlineFriends() {
    const onlineFriends = this.user.friendsList.filter((friend) => friend.isOnline);
    if (onlineFriends.length > 0) {
      this.onlineFriendsList = onlineFriends;
    } else {
      this.onlineFriendsList = [];
    }
  }

  private getOnlineFriendsList() {
    this.socketService.connect('connect');
  }

  private applyDefaultThemeOnStart() {
    this.themeService.changeThemeTo('default');
  }

  public changeTheme(theme: Theme) {
    const subscription = this.themeService.changeThemeTo(theme)?.subscribe({

      error: (err) => {
        this.matSnack.open(err.detail ? err.detail : 'Error saving theme, try again later', 'Dismiss', { duration: matSnackDuration });
        console.error(err);
      }
    });
    this.subscriptions.add(subscription);
  }

  public shouldShowOnlineFriends(friendsList: Friend[]): boolean {
    return friendsList.some((friends) => friends.isOnline);
  }

  public openAddFriendModal() {
    this.modalService.openModal(AddFriendModalComponent);
  }

  public openGroupChatModal() {
    this.modalService.openModal(GroupChatModalComponent)
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }
}
