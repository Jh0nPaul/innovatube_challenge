import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";


// Definición de interfaces para la respuesta de la API
// NOTA: Se ha agregado 'description' que es necesaria en el componente de búsqueda.
export interface Video {
  videoId: string;
  title: string;
  description: string; // <-- AÑADIDO: Necesario para el componente
  thumbnailUrl: string; // <-- CORREGIDO: Usamos thumbnailUrl, ya que backend la devuelve
  channelTitle: string;
  // Las propiedades 'thumbnail' y 'publishedAt' de tu original no son devueltas actualmente por el backend, 
  // por lo que las he ajustado/eliminado para que coincida con el controlador actual.
}

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  private http = inject(HttpClient);
  
  // CORREGIDO: Usamos la URL base que definiste. Este URL ya incluye '/api/videos'
  // Es crucial que esta URL sea la correcta para tu puerto 3000 de Codespaces.
  private apiBaseUrl = 'https://bug-free-lamp-9p7q696jxqph7qj7-3000.app.github.dev/api/videos';

  constructor() { }

  /**
   * Realiza una búsqueda de videos enviando el término de consulta al backend.
   * La solicitud es protegida por el TokenInterceptor.
   * @param query El término de búsqueda.
   * @returns Un Observable con el array de objetos Video (Video[]).
   */
  searchVideos(query: string): Observable<Video[]> {
    // CORREGIDO: Usamos 'apiBaseUrl' y concatenamos solo '/search'
    return this.http.get<Video[]>(`${this.apiBaseUrl}/search`, {
      params: { q: query } // Envía el término de búsqueda como parámetro de consulta 'q'
    });
  }
}
