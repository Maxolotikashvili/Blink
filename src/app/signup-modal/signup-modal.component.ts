import { Component } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';

@Component({
  selector: 'app-signup-modal',
  imports: [MaterialModule],
  templateUrl: './signup-modal.component.html',
  styleUrl: './signup-modal.component.scss'
})
export class SignupModalComponent {
  constructor() {}

  onSubmit() {
    
  }
}
