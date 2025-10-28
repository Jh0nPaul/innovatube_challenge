import { Injectable, inject } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; 
import { tap } from 'rxjs/operators';

// Definimos la misma interfaz aquí temporalmente
interface AuthResponse {
  token: string;
  msg: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. Inyección de dependencia moderna
  private http = inject(HttpClient); 
  
  // ¡¡¡ESTA ES LA RUTA CORREGIDA!!!
  // Debe incluir la URL de Codespaces + el prefijo del backend (/api/auth).
  private apiUrl = 'https://bug-free-lamp-9p7q696jxqph7qj7-3000.app.github.dev/api/auth'; 

  // 2. BehaviorSubject para el estado de autenticación
  private _isAuthenticated = new BehaviorSubject<boolean>(this.isLoggedIn()); 
  
  // Observable público para que el Navbar sea visible.
  public isAuthenticated$: Observable<boolean> = this._isAuthenticated.asObservable();

  constructor() { }

  register(email: string, password: string): Observable<AuthResponse> {
    // La ruta de registro ahora se construye correctamente:
    // .../api/auth + /register 
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password }) 
      .pipe(
        tap(res => this.saveToken(res.token))
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    // La ruta de login se construye correctamente:
    // .../api/auth + /login
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => this.saveToken(res.token))
      );
  }

  // ... (El resto del código del servicio es igual)
  private saveToken(token: string): void {
    localStorage.setItem('token', token);
    this._isAuthenticated.next(true); 
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this._isAuthenticated.next(false);
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken(); 
  }
}
