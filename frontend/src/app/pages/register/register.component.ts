import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common'; // Agregué CommonModule para usar @if, etc.

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-register',
  standalone: true,
  // Necesitas CommonModule para cosas como el manejo de errores (@if)
  // Reemplacé RouterModule por RouterLink, que es la práctica moderna en Standalone Components.
  imports: [CommonModule, RouterModule, ReactiveFormsModule], 
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Formulario reactivo para el registro
  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage: string | null = null;
  loading: boolean = false;

  constructor() { }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, introduce un email válido y una contraseña de al menos 6 caracteres.';
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.registerForm.value;

    // --- CORRECCIÓN CLAVE AQUÍ ---
    // Pasamos email y password como argumentos separados
    this.authService.register(email, password).pipe( 
      tap(() => {
        // Registro exitoso, redirige a la página de búsqueda
        this.loading = false;
        this.router.navigate(['/search']);
      }),
       catchError(error => {
        this.loading = false;
        // Manejo de errores (ej. usuario ya existe)
        // Usamos error.error?.message que viene de tu backend Express.
        const errorMsg = error.error?.message || 'Error al conectar con el servidor. Intenta de nuevo más tarde.';
        this.errorMessage = errorMsg;
        return of(null);
      })
    ).subscribe();
  }
}
