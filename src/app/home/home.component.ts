import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalService } from '../services/modal.service';
import { Observable } from 'rxjs';
import { SigninModalComponent } from '../signin-modal/signin-modal.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  isModalOpened$!: Observable<boolean>;

  contributorsList: {imageUrl: string, name: string, occupation: string}[] = [
    {imageUrl: 'maxo-lotikashvili.jpeg', name: 'Maxo Lotikashvili', occupation: 'Full-stack developer'},
    {imageUrl: 'maxo-lotikashvili.jpeg', name: 'Nini Meskhoradze', occupation: 'Front-end developer'},
    {imageUrl: 'maxo-lotikashvili.jpeg', name: 'Ani Merabishvili', occupation: 'Mathematician'},
    {imageUrl: 'maxo-lotikashvili.jpeg', name: 'Tako Lotikashvili', occupation: 'Designer'},
  ]
  constructor(private modalService: ModalService) {
    this.isModalOpened$ = modalService.isModalOpened$;
  }

  public openSignInPage() {
    this.modalService.openModal(SigninModalComponent);
  }
}
