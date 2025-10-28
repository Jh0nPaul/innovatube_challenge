import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Inject, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RecaptchaLoaderService } from './recaptcha-loader.service';

declare const grecaptcha: any;

@Component({
  selector: 'app-recaptcha',
  standalone: true,
  imports: [CommonModule],
  template: `<div #container class="inline-block"></div>`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RecaptchaComponent),
    multi: true
  }]
})
export class RecaptchaComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() siteKey!: string;                         // requerido
  @Input() theme: 'light' | 'dark' = 'dark';
  @Input() size: 'normal' | 'compact' = 'normal';
  @Output() verified = new EventEmitter<string>();

  @ViewChild('container', { static: true }) container!: ElementRef<HTMLElement>;

  private widgetId: number | null = null;
  private disabled = false;
  private onChange: (val: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private loader: RecaptchaLoaderService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  async ngAfterViewInit() {
    await this.loader.load();
    this.render();
  }

  ngOnDestroy(): void {
    // No hay API pública para destruir, pero podemos limpiar el contenedor si fuese necesario
  }

  private render() {
    if (!this.siteKey) throw new Error('siteKey es requerido');

    // Evitar renders duplicados (si el parent reusa el componente)
    this.container.nativeElement.innerHTML = '';

    this.widgetId = grecaptcha.render(this.container.nativeElement, {
      sitekey: this.siteKey,
      theme: this.theme,
      size: this.size,
      callback: (token: string) => {
        this.onChange(token);
        this.onTouched();
        this.verified.emit(token);
      },
      'expired-callback': () => {
        this.onChange(null);
        this.onTouched();
      },
      'error-callback': () => {
        this.onChange(null);
        this.onTouched();
      }
    });

    if (this.disabled && this.widgetId !== null) {
      grecaptcha.reset(this.widgetId); // no hay disable; si necesitas, puedes ocultar el contenedor
    }
  }

  // ControlValueAccessor
  writeValue(_val: string | null): void {
    // Cuando el form ponga null, reseteamos el widget
    if (this.widgetId !== null) grecaptcha.reset(this.widgetId);
  }
  registerOnChange(fn: (val: string | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    // grecaptcha no soporta disable; podrías ocultar/mostrar el contenedor si quisieras.
  }

  /** Permite reset manual desde el padre si lo necesitas */
  reset() {
    if (this.widgetId !== null) {
      grecaptcha.reset(this.widgetId);
      this.onChange(null);
    }
  }
}
