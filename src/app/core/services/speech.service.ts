import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpeechToText } from '../interfaces/speech';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  private readonly http   = inject(HttpClient);
  private readonly config = inject(ConfigService);

  private get base(): string {
    return `${this.config.apiUrl()}/api1`;
  }

  listar(active?: boolean): Observable<SpeechToText[]> {
    let params = new HttpParams();
    if (active !== undefined) {
      params = params.set('active', String(active));
    }
    return this.http.get<SpeechToText[]>(`${this.base}/transcripciones`, { params });
  }

  obtenerPorId(id: string): Observable<SpeechToText> {
    return this.http.get<SpeechToText>(`${this.base}/transcripciones/${id}`);
  }

  transcribir(url: string, lang: string): Observable<SpeechToText> {
    const params = new HttpParams().set('url', url).set('lang', lang);
    return this.http.get<SpeechToText>(`${this.base}/transcribir`, { params });
  }

  actualizar(id: string, url: string, lang?: string): Observable<SpeechToText> {
    let params = new HttpParams().set('url', url);
    if (lang) {
      params = params.set('lang', lang);
    }
    return this.http.put<SpeechToText>(`${this.base}/transcripciones/${id}`, null, { params });
  }

  eliminar(id: string): Observable<SpeechToText> {
    return this.http.delete<SpeechToText>(`${this.base}/transcripciones/delete/${id}`);
  }

  restaurar(id: string): Observable<SpeechToText> {
    return this.http.patch<SpeechToText>(`${this.base}/transcripciones/restaurar/${id}`, null);
  }
}
