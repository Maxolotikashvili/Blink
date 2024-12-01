import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignupModalComponent } from "./signup-modal/signup-modal.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SignupModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'blink';
}
