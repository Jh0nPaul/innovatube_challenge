import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface AuthResponse {
  token?: string;
  user?: any;
  msg?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = 'https://bug-free-lamp-9p7q696jxqph7qj7-3000.app.github.dev/auth';

  private _isAuthenticated = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isAuthenticated$: Observable<boolean> = this._isAuthenticated.asObservable();

  // Guarda token + usuario 
  private _tokenKey = 'token';
  private _userKey = 'user';

  private storeSession(token?: string, user?: any) {
    if (token) localStorage.setItem(this._tokenKey, token);
    if (user) localStorage.setItem(this._userKey, JSON.stringify(user));
    if (token) this._isAuthenticated.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this._tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this._tokenKey);
    localStorage.removeItem(this._userKey);
    this._isAuthenticated.next(false);
  }

  
  register(data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    // confirmPassword no se manda al backend
    confirmPassword?: string;
    recaptcha?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.storeSession(res.token, res.user))
    );
  }

  
  login(emailOrUsername: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { emailOrUsername, password }).pipe(
      tap(res => this.storeSession(res.token, res.user))
    );
  }

  requestPassword(emailOrUsername: string) {
  return this.http.post<{ msg: string; devResetLink?: string }>(`${this.apiUrl}/forgot-password`, { emailOrUsername });
}

resetPassword(token: string, newPassword: string) {
  return this.http.post<{ msg: string }>(`${this.apiUrl}/reset-password`, { token, newPassword });
}


}
