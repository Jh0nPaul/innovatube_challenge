import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = this.route.snapshot.queryParamMap.get('token') ?? '';
  form = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', [Validators.required]]
  });

  error: string | null = null;
  ok = false;
  loading = false;

  submit() {
    this.error = null;
    const { newPassword, confirm } = this.form.value;
    if (!newPassword || newPassword !== confirm) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }
    if (!this.token) {
      this.error = 'Token no encontrado.';
      return;
    }
    this.loading = true;
    this.auth.resetPassword(this.token, newPassword).subscribe({
      next: () => { this.ok = true; this.loading = false; setTimeout(() => this.router.navigate(['/login']), 1200); },
      error: (e) => { this.error = e?.error?.msg || 'No se pudo restablecer.'; this.loading = false; }
    });
  }
}
