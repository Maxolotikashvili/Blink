import { Component, isSignal, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../shared-modules/materia.module';
import { XMarkComponent } from "../x-mark/x-mark.component";
import { ModalService } from '../services/modal.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { passwordMatchValidator } from '../validators/password-match-validator';
import { SignupBackgroundSvgComponent } from "../signup-background-svg/signup-background-svg.component";
import { AuthService } from '../services/auth.service';
import { UserRegister } from '../model/auth.model';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderComponent } from "../loader/loader.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { HomeComponent } from '../home/home.component';
import { SigninModalComponent } from '../signin-modal/signin-modal.component';
import { matSnackDuration } from '../styles/active-theme-variables';

@Component({
  selector: 'app-signup-modal',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, XMarkComponent, SignupBackgroundSvgComponent, LoaderComponent],
  templateUrl: './signup-modal.component.html',
  styleUrl: './signup-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SignupModalComponent implements OnInit {
  public signupForm!: FormGroup;
  public isUserRegistrationPending: boolean = false;

  public get userName(): AbstractControl | null {
    return this.signupForm.get('username');
  }

  public get email(): AbstractControl | null {
    return this.signupForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.signupForm.get('password');
  }

  public get confirmPassword(): AbstractControl | null {
    return this.signupForm.get('confirmPassword');
  }

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private authService: AuthService,
    private matSnack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeUserSignUpForm();
  }

  private initializeUserSignUpForm() {
    this.signupForm = this.fb.group({
      username: new FormControl<string>('', Validators.required),
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]),
      confirmPassword: new FormControl<string>('', Validators.required)
    }, { validators: passwordMatchValidator })
  }

  public openLoginPage() {
    this.modalService.openModal(SigninModalComponent);
  }

  public handleSignupFormSubmit() {
    if (this.signupForm.status !== 'VALID') return;
    this.isUserRegistrationPending = true;
    
    const user: UserRegister = {
      username: this.userName?.value,
      email: this.email?.value,
      password: this.password?.value
    }
    
    this.authService.registerUser(user).subscribe({
      next: () => {
        this.matSnack.open('Registration Complete', 'Dismiss', {duration: matSnackDuration});
        this.modalService.closeAllPages();
      },

      error: (err: HttpErrorResponse) => {
        this.handleRegistrationErrors(err);
        this.isUserRegistrationPending = false;
      },
    })
  }

  private handleRegistrationErrors(err: HttpErrorResponse) {
    if (err.status === 400) {
      if (err.error.detail === 'Username already taken') {
        console.error(`Registration failed with status code of ${err.status}: ${err.error.detail}`)
        this.userName?.setErrors({ taken: true });
      }

      if (err.error.detail === 'Email already taken') {
        console.error(`Registration failed with status code of ${err.status}: ${err.error.detail}`)
        this.email?.setErrors({ taken: true })
      }
    }
  }

}
