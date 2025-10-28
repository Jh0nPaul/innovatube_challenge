import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideosService } from '../../services/video.service';

// Interfaz para definir la estructura de un video
interface Video {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-4 md:p-8 bg-gray-900 min-h-screen">
      <h1 class="text-4xl font-extrabold text-indigo-400 mb-8 text-center">InnovaTube - Búsqueda</h1>
      
      <!-- Formulario de Búsqueda -->
      <form [formGroup]="searchForm" (ngSubmit)="onSearchSubmit()" 
            class="max-w-xl mx-auto mb-8 flex space-x-2">
        <input 
          type="text" 
          formControlName="query" 
          placeholder="Busca videos sobre Angular, TypeScript, etc."
          class="flex-1 p-3 text-lg border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
        <button 
          type="submit" 
          [disabled]="searchForm.invalid || isLoading()"
          class="px-5 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
        >
          <span *ngIf="!isLoading()">Buscar</span>
          <span *ngIf="isLoading()">Cargando...</span>
        </button>
      </form>

      <!-- Indicadores de estado -->
      <div *ngIf="isLoading()" class="text-center text-indigo-400 text-xl mt-10">
        Buscando videos...
      </div>
      
      <div *ngIf="videos().length === 0 && !isLoading() && searchAttempted()" class="text-center text-gray-400 text-xl mt-10">
        No se encontraron resultados para "{{ searchForm.get('query')?.value }}" o la búsqueda está vacía.
      </div>

      <!-- Lista de Resultados de Videos -->
      <div *ngIf="videos().length > 0 && !isLoading()" 
           class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-6">
        
        <div *ngFor="let video of videos()" 
             class="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
          
          <!-- Thumbnail del Video -->
          <a [href]="'https://www.youtube.com/watch?v=' + video.videoId" target="_blank" rel="noopener noreferrer">
            <img [src]="video.thumbnailUrl" [alt]="video.title" class="w-full h-48 object-cover cursor-pointer transition duration-300 transform hover:scale-105">
          </a>

          <!-- Contenido del Video -->
          <div class="p-4">
            <h3 class="text-xl font-bold text-white mb-2 line-clamp-2">
              <a [href]="'https://www.youtube.com/watch?v=' + video.videoId" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-400 transition-colors">
                {{ video.title }}
              </a>
            </h3>
            <p class="text-sm text-gray-400 mb-3 line-clamp-3">
              {{ video.description }}
            </p>
            <div class="flex items-center justify-between text-sm text-gray-500">
              <span class="font-medium text-indigo-300">{{ video.channelTitle }}</span>
              
              <!-- Botón de Favorito (Pendiente de implementar) -->
              <button 
                class="text-red-400 hover:text-red-500 transition-colors"
                title="Añadir a Favoritos (Próximamente)"
                disabled
              >
                <!-- Icono de Corazón -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.807 15.807 0 0 1-4.568 2.058L2.4 20.654a9.75 9.75 0 0 1 10.353-8.204L12 12l.047.001A9.75 9.75 0 0 1 21.6 20.654l-4.507-2.058a15.807 15.807 0 0 1-4.569-2.058Z" />
                  <path d="M12 12v9.75M12 12l-4.507-2.058a15.807 15.807 0 0 0-4.568 2.058L2.4 20.654a9.75 9.75 0 0 0 10.353-8.204" />
                </svg>

              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Estilos base para Tailwind */
    :host {
      display: block;
      color: white;
    }
    .line-clamp-2 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .line-clamp-3 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }
  `]
})
export class SearchComponent implements OnInit {
  
  // Inyección de dependencias usando 'inject' (modern Angular)
  private fb = inject(FormBuilder);
  private videoService = inject(VideosService);
  // Opcional: el authService se puede usar más adelante para verificar si está logeado
  // private authService = inject(AuthService); 

  // --- Estado del componente usando Signals ---
  videos = signal<Video[]>([]);
  isLoading = signal<boolean>(false);
  searchAttempted = signal<boolean>(false); // Para mostrar el mensaje "No resultados" solo después de buscar

  // Definición del formulario reactivo
  searchForm: FormGroup;

  constructor() {
    this.searchForm = this.fb.group({
      query: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Si la aplicación redirige a 'search' al inicio, puedes poner una búsqueda por defecto aquí
    // this.searchForm.get('query')?.setValue('Angular Firebase');
    // this.onSearchSubmit();
  }

  /**
   * Maneja el envío del formulario de búsqueda.
   */
  onSearchSubmit(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const query = this.searchForm.get('query')?.value;
    this.isLoading.set(true);
    this.searchAttempted.set(true); // Indica que ya se intentó una búsqueda
    this.videos.set([]); // Limpiar resultados anteriores

    // Llama al servicio que se comunica con el backend
    this.videoService.searchVideos(query).subscribe({
      next: (data) => {
        // Asume que el backend mapea los datos a la interfaz Video[]
        this.videos.set(data as Video[]); 
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error en la búsqueda de videos:', err);
        this.isLoading.set(false);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }
}
