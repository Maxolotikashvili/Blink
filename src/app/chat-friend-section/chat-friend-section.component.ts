import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';

@Component({
  selector: 'app-chat-friend-section',
  imports: [CommonModule, MaterialModule],
  templateUrl: './chat-friend-section.component.html',
  styleUrl: './chat-friend-section.component.scss'
})
export class ChatFriendsSectionComponent {
  buttonActionsList: {imgUrl: string, title: string}[]= [{imgUrl: 'retro-background.jpeg', title: 'Mute'}, {imgUrl: 'maxo-lotikashvili.jpeg', title: 'Mark read'}, {imgUrl: 'emoji.png', title: 'Delete chat'}, {imgUrl: 'signup-chat-background.png', title: 'Remove friend'}];
  
  constructor() {}
}
