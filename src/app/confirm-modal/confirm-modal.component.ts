import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmModalService } from '../services/confirm-modal.service';
import { XMarkComponent } from '../x-mark/x-mark.component';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { matSnackDuration } from '../styles/active-theme-variables';
import { ModalData } from '../model/modal-data.model';
import { CommonModule } from '@angular/common';
import { ModalService } from '../services/modal.service';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule, MatButtonModule, XMarkComponent],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  public modalData!: ModalData;

  constructor(
    private confirmModalService: ConfirmModalService,
    private authService: AuthService,
    private modalService: ModalService,
    private chatService: ChatService,
    private router: Router,
    private socketService: SocketService,
    private matSnack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  public getData() {
    this.confirmModalService.refreshData();
    this.modalData = this.confirmModalService.data;
  }

  public performProceedAction() {
    if (this.modalData.action === 'delete' && this.modalData.lastSelectedFriend) {
      this.deleteFriend();
    } else if (this.modalData.action === 'logout') {
      this.logOut();
    }
  }

  public performCancelAction() {
    this.modalService.closeAllPages();
  }

  public deleteFriend() {
    const subscription = this.authService.deleteFriend(this.modalData.lastSelectedFriend!).subscribe({
      next: (res: { message: string }) => {
        this.matSnack.open(res.message, 'Dismiss', { duration: matSnackDuration });
        this.modalService.closeAllPages();
      },

      error: (err) => {
        this.matSnack.open(err.detail ? err.detail : `Error deleting ${this.modalData.lastSelectedFriend?.username}, try again later`, 'Dismiss', { duration: matSnackDuration });
        console.error(err);
      }
    })

    this.subscriptions.add(subscription);
  }

  public logOut() {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    this.router.navigate(['/home']);
    this.socketService.disconnectFromAllSockets();
    this.modalService.closeAllPages();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
