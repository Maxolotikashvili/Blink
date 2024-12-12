import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';

@Component({
  selector: 'app-chat-text-area',
  imports: [CommonModule, MaterialModule],
  templateUrl: './chat-text-area.component.html',
  styleUrl: './chat-text-area.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ChatTextAreaComponent implements OnInit {
  chatList: { sender: string, text: string }[] = [];

  sounds = {
    messageSend: ''
  }

  constructor() { }

  ngOnInit(): void {

  }

  handleTextSend(textArea: HTMLTextAreaElement, event: MouseEvent | KeyboardEvent) {
    if (event instanceof KeyboardEvent && event.code !== 'Enter') {
      
      return;
    } else {
      event.preventDefault() // prevent Enter key from creating new line when pressed;
    }

    if (textArea.value.trim().length === 0) {
      return;
    }

    this.chatList.push({
      sender: 'user',
      text: textArea.value
    })

    textArea.value = '';
  }
}
