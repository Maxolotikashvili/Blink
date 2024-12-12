import { AbstractControl } from "@angular/forms";

export const passwordMatchValidator = (control: AbstractControl) => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordsMismatch: true });
        return { passwordsMismatch: true };
    }

    if (confirmPassword?.hasError('passwordsMismatch')) {
        confirmPassword.setErrors(null);
    }

    return null
}