import { Injectable } from '@angular/core';
import { ModalData } from '../model/modal-data.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmModalService {
  public data!: ModalData;
  
  constructor() { }

  public refreshData() {
    if (this.data.action !== 'delete') {
      this.data.lastSelectedFriend = undefined;
    }
  }
}
