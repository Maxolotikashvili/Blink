import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { AddFriendModalComponent } from '../add-friend-modal/add-friend-modal.component';
import { AuthService } from '../services/auth.service';
import { map, Observable } from 'rxjs';
import { NotificationsComponent } from '../notifications/notifications.component';
import { GroupChatModalComponent } from '../group-chat-modal/group-chat-modal.component';
import { SocketService } from '../services/socket.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ConfirmModalService } from '../services/confirm-modal.service';

@Component({
  selector: 'app-chat-sidebar',
  imports: [CommonModule],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.scss'
})
export class ChatSidebarComponent implements OnInit {
  sidebarLocationX: number = 0;
  isSidebarShrinked: boolean = false;
  userNotificationsLength$!: Observable<number>;

  constructor(
    private confirmModalService: ConfirmModalService,
    private modalService: ModalService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getUserNotificationsSize();
  }

  getUserNotificationsSize() {
    this.userNotificationsLength$ = this.authService.user$.pipe(map((user) => user.notifications.filter((notification) => !notification.isSeenByUser).length));
  }

  moveSidebar() {
    this.sidebarLocationX = this.isSidebarShrinked ? 0 : -60;
    this.isSidebarShrinked = !this.isSidebarShrinked;
  }

  logOut() {
    this.confirmModalService.data = {
      action: 'logout'
    }
    this.modalService.openModal(ConfirmModalComponent);
  }

  openNotificationsModal() {
    this.modalService.openModal(NotificationsComponent);
  }

  openAddFriendModal() {
    this.modalService.openModal(AddFriendModalComponent)
  }

  openGroupChatModal() {
    this.modalService.openModal(GroupChatModalComponent);
  }
}
