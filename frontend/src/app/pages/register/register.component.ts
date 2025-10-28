import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError, of, tap } from 'rxjs';
import { RecaptchaComponent } from '../../shared/recaptcha/recaptcha.component';


function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, RecaptchaComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'], 
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(60)]],
    lastName:  ['', [Validators.required, Validators.maxLength(60)]],
    username:  ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    email:     ['', [Validators.required, Validators.email]],
    password:  ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    recaptcha: ['', [Validators.required]],
  }, { validators: passwordMatchValidator() });

  errorMessage: string | null = null;
  loading = false;

   onSubmit(): void {
    this.errorMessage = null;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = this.registerForm.hasError('passwordMismatch')
        ? 'Las contraseñas no coinciden.'
        : 'Revisa los campos obligatorios.';
      return;
    }

    this.loading = true;
    const { email, password } = this.registerForm.value as { email: string; password: string };


    const payload = this.registerForm.value;
    this.authService.register(payload).pipe(
      tap(() => { this.loading = false; this.router.navigate(['/search']); }),
      catchError((error) => { this.loading = false; this.errorMessage = error?.error?.message || 'Error al conectar con el servidor.'; return of(null); })
    ).subscribe();
  }
  }

