import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { LoaderComponent } from "../loader/loader.component";
import { CommonModule } from '@angular/common';
import { XMarkComponent } from "../x-mark/x-mark.component";
import { Friend } from '../model/friend.model';
import { AuthService } from '../services/auth.service';
import { MaterialModule } from '../shared-modules/materia.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-chat-modal',
  imports: [CommonModule, FormsModule, LoaderComponent, XMarkComponent, MaterialModule],
  templateUrl: './group-chat-modal.component.html',
  styleUrl: './group-chat-modal.component.scss'
})
export class GroupChatModalComponent implements OnInit {
  isLoading$!: Observable<boolean>
  friends$!: Observable<Friend[]>;
  selectedFriendsList: Friend['username'][] = [];

  constructor(private socketService: SocketService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getLoadingState();
    this.getUserFriendsList();
  }

  getLoadingState() {
    this.isLoading$ = this.socketService.isSocketLoading$;
  }

  getUserFriendsList() {
    this.friends$ = this.authService.user$.pipe(map((user) => user.friendsList));
  }

  addFriendToGroupChat(friend: Friend) {
    if (!this.selectedFriendsList.includes(friend.username)) {
      this.selectedFriendsList.push(friend.username);
    } else {
      this.selectedFriendsList.splice(this.selectedFriendsList.indexOf(friend.username), 1);
    }
  }

  filterFriends(input: HTMLInputElement) {
    this.friends$ = this.friends$.pipe(map((friends) => friends.filter((friend) => friend.username.includes(input.value))))
  }

  createGroupChat() {
    this.socketService.createGroupChat(this.selectedFriendsList);
  }
}
