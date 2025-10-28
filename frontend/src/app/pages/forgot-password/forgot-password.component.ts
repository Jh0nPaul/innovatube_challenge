import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  form = this.fb.group({
    emailOrUsername: ['', [Validators.required]]
  });

  message: string | null = null;
  loading = false;

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.message = null;

    this.auth.requestPassword(this.form.value.emailOrUsername!)
      .subscribe({
        next: (res) => {
          this.message = res.msg + (res.devResetLink ? ` (DEV: ${res.devResetLink})` : '');
          this.loading = false;
        },
        error: () => { this.message = 'No se pudo procesar.'; this.loading = false; }
      });
  }
}
