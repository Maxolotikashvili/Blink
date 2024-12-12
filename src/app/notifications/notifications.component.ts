import { Component, OnInit } from '@angular/core';
import { NotificationWebSocketService } from '../services/notification-web-socket.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  constructor(private websocketService: NotificationWebSocketService, private authService: AuthService) {}

  ngOnInit(): void {
    
  }
}
