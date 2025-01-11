import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared-modules/materia.module';
import { XMarkComponent } from "../x-mark/x-mark.component";
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";
import { SocketService } from '../services/socket.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-friend-modal',
  imports: [FormsModule, MaterialModule, XMarkComponent, CommonModule, LoaderComponent],
  templateUrl: './add-friend-modal.component.html',
  styleUrl: './add-friend-modal.component.scss'
})
export class AddFriendModalComponent implements OnInit {
  public isLoading$!: Observable<boolean>;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.getLoadingState();
  }

  private getLoadingState() {
    this.isLoading$ = this.socketService.isSocketLoading$;
  }

  public addFriend(input: HTMLInputElement, event?: KeyboardEvent) {
    if (input.value.trim() === '' || event && event?.key !== 'Enter') {
      return;
    } else {
      this.socketService.addFriend(input.value);
      input.value = '';
    };
  }
}
