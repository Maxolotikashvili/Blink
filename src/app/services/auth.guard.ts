import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ModalService } from './modal.service';
import { SigninModalComponent } from '../signin-modal/signin-modal.component';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const modalService = inject(ModalService);
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  if (token) {
    return true;
  } else {
    router.navigate(['/home']);
    // modalService.openModal(SigninModalComponent);
    return false;
  }
};
