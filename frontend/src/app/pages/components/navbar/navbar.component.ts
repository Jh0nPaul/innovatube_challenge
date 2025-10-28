import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';

import { Router,RouterLink} from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AsyncPipe, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // Inyectar el servicio de autenticación
  authService = inject(AuthService);
  router = inject(Router);

  // Observable para el estado de autenticación (true/false)
  isAuthenticated$ = this.authService.isAuthenticated$;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
