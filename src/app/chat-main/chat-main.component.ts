import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';
import { CommonModule } from '@angular/common';
import { ChatUserSectionComponent } from "../chat-user-section/chat-user-section.component";
import { ChatSidebarComponent } from "../chat-sidebar/chat-sidebar.component";
import { ChatTextAreaComponent } from "../chat-text-area/chat-text-area.component";
import { ChatFriendsSectionComponent } from "../chat-friend-section/chat-friend-section.component";
import { ThemeService } from '../services/theme.service';
import { Observable, Subscription } from 'rxjs';
import { LoaderComponent } from "../loader/loader.component";
import { NotificationWebSocketService } from '../services/notification-web-socket.service';
import { AuthService } from '../services/auth.service';
import { User } from '../model/auth.model';

@Component({
  selector: 'app-chat-main',
  imports: [CommonModule, MaterialModule, ChatUserSectionComponent, ChatSidebarComponent, ChatTextAreaComponent, ChatFriendsSectionComponent, LoaderComponent],
  templateUrl: './chat-main.component.html',
  styleUrl: './chat-main.component.scss'
})
export class ChatMainComponent implements OnInit, OnDestroy {
  isLoading$!: Observable<boolean>
  private activeUserSubscription!: Subscription;

  constructor(
    private themeService: ThemeService,
    private notificationWebSocketService: NotificationWebSocketService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.connectToSocket();
    this.initiateLoaderDuringThemeSwitch();
  }

  connectToSocket() {
    this.activeUserSubscription = this.authService.getuserInfo$().subscribe((user: {user: User}) => {
      this.authService.updateUser(user.user);
      this.notificationWebSocketService.connect(user.user.userId);
    })
  }

  initiateLoaderDuringThemeSwitch() {
    this.isLoading$ = this.themeService.isThemeSwitched$;
  }

  ngOnDestroy(): void {
    this.activeUserSubscription.unsubscribe();
  }
}
