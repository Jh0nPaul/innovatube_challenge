import { Injectable, inject } from '@angular/core'; // Agregamos 'inject'
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; // Agregamos 'BehaviorSubject'
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
  
  private apiUrl = 'http://localhost:3000/api/auth'; 
  
  // 2. BehaviorSubject para el estado de autenticación
  // Inicializamos mirando si ya hay un token guardado.
  private _isAuthenticated = new BehaviorSubject<boolean>(this.isLoggedIn()); 
  
  // Observable público para que el Navbar sea visible.
  public isAuthenticated$: Observable<boolean> = this._isAuthenticated.asObservable();


  constructor() { }

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password })
      .pipe(
        tap(res => this.saveToken(res.token))
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => this.saveToken(res.token))
      );
  }

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
  }spoty
  

  isLoggedIn(): boolean {
    return !!this.getToken(); 
  }
}
