import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { AddFriendModalComponent } from '../add-friend-modal/add-friend-modal.component';

@Component({
  selector: 'app-chat-sidebar',
  imports: [CommonModule],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.scss'
})
export class ChatSidebarComponent implements OnInit {
  sidebarLocationX: number = 0;
  isSidebarShrinked: boolean = false;

  constructor(private router: Router, private modalService: ModalService) { }

  ngOnInit(): void {

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
