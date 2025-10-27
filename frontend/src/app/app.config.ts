import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// 1. Importar el proveedor HTTP
import { provideHttpClient } from '@angular/common/http'; 

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // 2. Provisión del cliente HTTP
    provideHttpClient(), 
    provideRouter(routes)
    ]
};