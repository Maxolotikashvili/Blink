import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { fromEvent, Observer } from 'rxjs';

@Component({
  selector: 'app-x-mark',
  imports: [CommonModule],
  templateUrl: './x-mark.component.html',
  styleUrl: './x-mark.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class XMarkComponent implements OnInit {
  @Input() isForBurger!: boolean;
  @Input() size!: 'small' | 'default' | 'big';
  @Input() color!: string; 

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.listenToEscButton();
  }

  listenToEscButton() {
    fromEvent<KeyboardEvent>(window, 'keydown').subscribe((event) => {
      if (event.key === 'Escape') {
        this.handleClick();
      }
    })
  }

  handleClick() {
    if (!this.isForBurger) {
      this.modalService.closeAllPages();
    }
  }

  getXmarkWidth(): string {
    const sizes = {
      small: '10px',
      default: '20px',
      big: '40px'
    }

    return sizes[this.size] || sizes.default;
  }
}
