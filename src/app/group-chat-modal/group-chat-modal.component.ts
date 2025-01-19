import { Component, OnInit } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { LoaderComponent } from "../loader/loader.component";
import { CommonModule } from '@angular/common';
import { XMarkComponent } from "../x-mark/x-mark.component";
import { Friend } from '../model/friend.model';
import { AuthService } from '../services/auth.service';
import { MaterialModule } from '../shared-modules/materia.module';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { matSnackDuration } from '../styles/active-theme-variables';

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

  constructor(
    private socketService: SocketService,
    private authService: AuthService,
    private matSnack: MatSnackBar
  ) { }

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

  checkIfGroupChatIsCreatable() {
    if (this.selectedFriendsList.length < 2) {
      return;
    }

    this.authService.user$.pipe(map((user) => user.groupChatsList), take(1)).subscribe((groupChatsList) => {
      let isGroupChatCreatable: boolean = false;

      if (groupChatsList.length === 0) {
        isGroupChatCreatable = true; 
        this.createGroupChat(isGroupChatCreatable);
        return;
      }

      if (!this.selectedFriendsList.includes('user')) {
        this.selectedFriendsList.push('user');
      }

      const groupChatUsersList = [...groupChatsList].map((groupChat) => groupChat.users.map((user) => user.username));
      for (let users of groupChatUsersList) {
        if (this.areArraysIdentical(users, this.selectedFriendsList)) {
          isGroupChatCreatable = false;
        } else {
          isGroupChatCreatable = true;
        }
      }

     this.createGroupChat(isGroupChatCreatable);
    });
  }

  private createGroupChat(isCreatable: boolean) {
    if (isCreatable) {
      this.socketService.createGroupChat(this.selectedFriendsList);
    } else {
      this.matSnack.open('Group chat with these users already exist', 'Dismiss', { duration: matSnackDuration });
    }
  }

  private areArraysIdentical(array1: string[] | number[], array2: string[] | number[]) {
    if (array1.length !== array2.length) {
      return false;
    }

    array1.sort();
    array2.sort();

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }

    return true;
  }

}
