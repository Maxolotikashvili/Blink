import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationWebSocketService {
  private socket: WebSocket | null = null;
  private notifications: any[] = [];  // Store notifications
  public pendingRequests: number = 0;  // Store the count of pending friend requests

  constructor() { }

  connect(userId: string) {
    const wsUrl = `ws://127.0.0.1:8000/ws/${userId}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('Connected to WebSocket');
    }

    this.socket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      console.log('Received notification:', notification);

      // Add the notification to the list
      this.notifications.push(notification);
      
      // Update the count of pending friend requests
      this.pendingRequests += 1;

      // Call a method to update the notification bell icon (UI)
      this.updateNotificationUI();
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    }
  }

  // Method to update the notification UI
  updateNotificationUI() {
    console.log(`You have ${this.pendingRequests} new friend requests!`);
    // Here you can trigger the UI update. For example, using a service to show/hide the notification bell.
  }

  getNotifications() {
    return this.notifications;
  }
}
