import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';
import { XMarkComponent } from "../x-mark/x-mark.component";
import { ModalService } from '../services/modal.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderComponent } from "../loader/loader.component";
import { LoginResponse, UserLogin } from '../model/auth.model';
import { Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SignupModalComponent } from '../signup-modal/signup-modal.component';
import { matSnackDuration } from '../styles/active-theme-variables';

@Component({
  selector: 'app-signin-modal',
  imports: [CommonModule, MaterialModule, XMarkComponent, ReactiveFormsModule, LoaderComponent],
  templateUrl: './signin-modal.component.html',
  styleUrl: './signin-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SigninModalComponent implements OnInit {
  loginForm!: FormGroup;
  isUserLoginPending: boolean = false;
  isRememberMeChecked: boolean = false;

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private authService: AuthService,
    private matSnack: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.redirectToChatIfUserHasToken();
    this.initializeUserForm();
  }

  redirectToChatIfUserHasToken() {
    if (localStorage.getItem('access_token') || sessionStorage.getItem('access_token')) {
      this.modalService.closeAllPages();
      this.router.navigate(['/chat-main']);
    }
  }

  initializeUserForm() {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    })
  }

  openRegisterPage() {
    this.modalService.openModal(SignupModalComponent);
  }

  rememberUserForFutureLogins(event: MatCheckboxChange) {
    if (event.checked) {
      this.isRememberMeChecked = true;
    } else {
      this.isRememberMeChecked = false;
    }
  }

  handleSignin() {
    if (this.loginForm.status !== 'VALID') return;
    this.isUserLoginPending = true;

    const user: UserLogin = {
      email: this.email?.value,
      password: this.password?.value
    }

    this.authService.loginUser(user).subscribe({
      next: (res: LoginResponse) => {
        this.isUserLoginPending = false;
        this.modalService.closeAllPages();

        if (this.isRememberMeChecked) {
          localStorage.setItem('access_token', res.access_token);
        } else {
          sessionStorage.setItem('access_token', res.access_token);
        }

        this.router.navigate(['/chat-main']);
      },

      error: (error: HttpErrorResponse) => {
        console.error(error)

        this.isUserLoginPending = false;

        this.matSnack.open(error.error.detail, 'Dismiss', { duration: matSnackDuration });
      }
    })
  }
}
