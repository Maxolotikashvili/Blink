import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { AddFriendModalComponent } from '../add-friend-modal/add-friend-modal.component';
import { AuthService } from '../services/auth.service';
import { User } from '../model/auth.model';
import { map, Observable } from 'rxjs';

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
    private router: Router, 
    private modalService: ModalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUserNotificationsSize();
  }

  getUserNotificationsSize() {
    this.userNotificationsLength$ = this.authService.user$.pipe(map((user) => user.notifications.length));
  }

  moveSidebar() {
    this.sidebarLocationX = this.isSidebarShrinked ? 0 : -60;
    this.isSidebarShrinked = !this.isSidebarShrinked;
  }

  logOut() {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    this.router.navigate(['/home']);
  }

  addFriend() {
    this.modalService.openModal(AddFriendModalComponent)
  }
}
