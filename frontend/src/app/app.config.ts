import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// 1. Importar el proveedor HTTP
import { provideHttpClient, withInterceptors} from '@angular/common/http'; 


import { routes } from './app.routes';
import { TokenInterceptor } from './interceptors/token.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // 2. Provisión del cliente HTTP
    provideHttpClient(
      withInterceptors(
        [TokenInterceptor])
      ), 
    provideRouter(routes)
    ]
};