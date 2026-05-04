import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WhatsApp } from '../interfaces/whatsapp';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class WhatsAppService {
  private readonly http   = inject(HttpClient);
  private readonly config = inject(ConfigService);

  private get base(): string {
    return `${this.config.apiUrl()}/api2`;
  }

  listar(active?: boolean): Observable<WhatsApp[]> {
    let params = new HttpParams();
    if (active !== undefined) {
      params = params.set('active', String(active));
    }
    return this.http.get<WhatsApp[]>(`${this.base}/registros`, { params });
  }

  obtenerPorId(id: string): Observable<WhatsApp> {
    return this.http.get<WhatsApp>(`${this.base}/registros/${id}`);
  }

  validar(numero: string): Observable<WhatsApp> {
    const params = new HttpParams().set('numero', numero);
    return this.http.post<WhatsApp>(`${this.base}/validar`, null, { params });
  }

  revalidar(id: string): Observable<WhatsApp> {
    return this.http.put<WhatsApp>(`${this.base}/registros/revalidar/${id}`, null);
  }

  eliminar(id: string): Observable<WhatsApp> {
    return this.http.delete<WhatsApp>(`${this.base}/registros/delete/${id}`);
  }

  restaurar(id: string): Observable<WhatsApp> {
    return this.http.patch<WhatsApp>(`${this.base}/registros/restaurar/${id}`, null);
  }
}
