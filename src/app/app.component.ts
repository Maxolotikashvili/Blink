import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ModalService } from './services/modal.service';
import { SoundService } from './services/sound.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'blink';

  constructor(private router: Router, private modalService: ModalService) { 
  }
  
  ngOnInit(): void {
    this.redirectToChatMainIfRememberMeIsChecked();
  }

  redirectToChatMainIfRememberMeIsChecked() {
    this.modalService.closeAllPages();

    if (localStorage.getItem('access_token')) {
      this.router.navigate(['/chat-main']);
    }
  }
}
