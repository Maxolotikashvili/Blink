import { Injectable, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isModalOpened: Subject<boolean> = new Subject<boolean>();
  readonly isModalOpened$: Observable<boolean> = this.isModalOpened as Observable<boolean>;

  constructor(private dialog: MatDialog) { }

  public openModal(component: Type<any>) {
    const modalParams = {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100%',
      height: '100%',
      autoFocus: false,
      disableClose: true
    }
    
    this.closeAllPages();
    this.dialog.open(component, modalParams);
    this.isModalOpened.next(true);
  }

  public closeAllPages() {
    if (this.dialog.openDialogs.length > 0) {
      this.dialog.closeAll();
      this.isModalOpened.next(false);
    }
  }
}
