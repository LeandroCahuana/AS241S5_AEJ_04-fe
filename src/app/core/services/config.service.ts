import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'api_base_url';
const DEFAULT_URL  = 'http://localhost:8081';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _apiUrl   = signal<string>(this.loadUrl());

  /** URL actual del backend (reactiva) */
  readonly apiUrl = this._apiUrl.asReadonly();

  setApiUrl(url: string): void {
    const clean = url.trim().replace(/\/$/, '');
    this._apiUrl.set(clean);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, clean);
    }
  }

  resetApiUrl(): void {
    this._apiUrl.set(DEFAULT_URL);
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private loadUrl(): string {
    if (this.isBrowser) {
      return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_URL;
    }
    return DEFAULT_URL;
  }
}
