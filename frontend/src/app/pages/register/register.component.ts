import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'], // <- plural
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  errorMessage: string | null = null;
  loading = false;

  onSubmit(): void {
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, introduce un email válido y una contraseña de al menos 6 caracteres.';
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.registerForm.value as { email: string; password: string };

    this.authService.register(email, password).pipe(
      tap(() => {
        this.loading = false;
        this.router.navigate(['/search']);
      }),
      catchError((error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Error al conectar con el servidor. Intenta de nuevo más tarde.';
        return of(null);
      })
    ).subscribe();
  }
}
