import { Injectable } from '@angular/core';

declare global {
  interface Window { grecaptcha?: any; }
}

@Injectable({ providedIn: 'root' })
export class RecaptchaLoaderService {
  private _loading?: Promise<void>;

  load(): Promise<void> {
    if (window.grecaptcha) return Promise.resolve();
    if (this._loading) return this._loading;

    this._loading = new Promise<void>((resolve, reject) => {
      const id = 'google-recaptcha-script';
      if (document.getElementById(id)) { resolve(); return; }

      const script = document.createElement('script');
      script.id = id;
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar reCAPTCHA'));
      document.head.appendChild(script);
    });

    return this._loading;
  }
}
