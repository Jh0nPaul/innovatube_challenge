import { Injectable, inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectar el servicio de autenticación
  const authService = inject(AuthService);
  
  // Obtener el token almacenado
  const token = authService.getToken();

  // Si el token existe, clonamos la solicitud y añadimos el encabezado 'Authorization'
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // Formato estándar para JWT
      }
    });
    return next(authReq);
  }
  return next(req);
};
