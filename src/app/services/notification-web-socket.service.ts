import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationWebSocketService {
  private socket: WebSocket | null = null;
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

      // You can implement logic here to display the notification in your UI
      this.handleNewNotification(notification);
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    }
  }

  // This method is called when a new notification is received
  handleNewNotification(notification: any) {
    console.log('Handling new notification:', notification);

    // Update the count of pending friend requests if it's a friend request
    if (notification.type === 'friend-request') {
      this.pendingRequests += 1;
    }

    // Here you can implement the logic to update the notification UI (e.g., show a badge, etc.)
    this.updateNotificationUI();
  }

  // Method to update the notification UI (e.g., show a notification bell)
  updateNotificationUI() {
    console.log(`You have ${this.pendingRequests} new friend requests!`);
    // Trigger UI update (e.g., change notification bell icon, etc.)
  }
}
