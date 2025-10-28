import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user = { email: '', password: '' };
  isLoading = false;
  errorMessage: string | null = null;

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = null;

    if (!this.user.email || !this.user.password) {
      this.errorMessage = 'Por favor, introduce email y contraseña.';
      this.isLoading = false;
      return;
    }

    this.authService.login(this.user.email, this.user.password).subscribe({
      next: () => this.router.navigate(['/search']),
      error: (err) => {
        this.errorMessage = err?.error?.msg || 'Error de conexión. Revisa las credenciales.';
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false),
    });
  }
}
