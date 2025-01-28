import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  if (token) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
