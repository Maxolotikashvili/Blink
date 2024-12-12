import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddFriendService } from '../services/addFriend.service';
import { MaterialModule } from '../shared-modules/materia.module';
import { XMarkComponent } from "../x-mark/x-mark.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";
import { matSnackDuration } from '../styles/active-theme-variables';

@Component({
  selector: 'app-add-friend-modal',
  imports: [FormsModule, MaterialModule, XMarkComponent, CommonModule, LoaderComponent],
  templateUrl: './add-friend-modal.component.html',
  styleUrl: './add-friend-modal.component.scss'
})
export class AddFriendModalComponent {
  isLoading: boolean = false;
  friendName: string = "";

  constructor(
    private addfriendService: AddFriendService, 
    private matSnack: MatSnackBar,
  ) {}

  addFriend() {
    this.isLoading = true;
    this.addfriendService.addFriend(this.friendName).subscribe({
      next: (res: {message: string}) => {
        this.matSnack.open(res.message, 'Dismiss', {duration: matSnackDuration});
        this.isLoading = false;
      },

      error: (error) => {
        this.isLoading = false;
        this.matSnack.open(error.error.detail, 'Dismiss', {duration: matSnackDuration});
        console.log(error);
      }
    });
  }
}
