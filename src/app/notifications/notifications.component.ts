import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { XMarkComponent } from "../x-mark/x-mark.component";
import { map, Observable, Subscription } from 'rxjs';
import { Notification } from '../model/notification.model';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { matSnackDuration } from '../styles/active-theme-variables';
import { SocketService } from '../services/socket.service';
import { ChatDatePipe } from '../pipes/chat-date.pipe';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, XMarkComponent, MatDividerModule, ChatDatePipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NotificationsComponent implements OnInit {
  private subscriptions: Subscription = new Subscription();
  public notifications!: Notification[];

  constructor(
    private socketService: SocketService,
    private authService: AuthService,
    private matSnack: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getNotifications();
    this.markAllNotificationsAsSeen();
  }

  private markAllNotificationsAsSeen() {
    if (!this.notifications.some((notification) => !notification.isSeenByUser)) {
      return;
    }

    this.authService.markAllNotificationsAsSeen().subscribe({
      next: (res) => {
        this.authService.updateNotificationsAfterSeing();
      },
      error: (err) => {
        if (err.detail) {
          this.matSnack.open(err.detai, 'Dismiss', { duration: matSnackDuration });
        }
      }
    })
  }

  private getNotifications() {
    const subscription = this.authService.user$.pipe(map((user) => user.notifications)).subscribe((notifications) => {
      this.notifications = notifications;
    });

    this.subscriptions.add(subscription);
  }

  public deleteNotification(notification: Notification) {
    const subscription = this.authService.deleteNotification(notification.id).subscribe({
      error: (err) => {
        this.matSnack.open(err.detail ? err.detail : 'Error deleting notification', 'Dismiss', { duration: matSnackDuration })
        console.error(err);
      }
    })

    this.subscriptions.add(subscription);
  }

  public respondToFriendRequest(senderEmail: string, response: boolean) {
    this.socketService.acceptFriendRequest(senderEmail, response);
  }
}
