import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { XMarkComponent } from "../x-mark/x-mark.component";
import { map, Observable } from 'rxjs';
import { Notification } from '../model/notification.model';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { matSnackDuration } from '../styles/active-theme-variables';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, XMarkComponent, MatDividerModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NotificationsComponent implements OnInit {
  notifications$!: Observable<Notification[]>;

  constructor(
    private socketService: SocketService,
    private authService: AuthService,
    private matSnack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getNotifications();
  }

  private getNotifications() {
    this.notifications$ = this.authService.user$.pipe(map((user) => user.notifications));
  }

  public deleteNotification(notification: Notification) {
    this.authService.deleteNotification(notification.notificationId).subscribe({
      error: (err) => {
        this.matSnack.open(err.detail ? err.detail : 'Error deleting notification', 'Dismiss', { duration: matSnackDuration })
        console.error(err);
      }
    })
  }

  public respondToFriendRequest(senderEmail: string, response: boolean) {
    this.socketService.acceptFriendRequest(senderEmail, response);
  }
}
