import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../../core/services/config.service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsComponent {
  private readonly config = inject(ConfigService);

  urlInput  = this.config.apiUrl();
  saved     = signal(false);
  error     = signal('');

  get currentUrl(): string {
    return this.config.apiUrl();
  }

  guardar(): void {
    this.error.set('');
    const trimmed = this.urlInput.trim();

    if (!trimmed) {
      this.error.set('La URL no puede estar vacía.');
      return;
    }

    try {
      new URL(trimmed);
    } catch {
      this.error.set('Ingresa una URL válida (ej: http://localhost:8081).');
      return;
    }

    this.config.setApiUrl(trimmed);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }

  restaurar(): void {
    this.config.resetApiUrl();
    this.urlInput = this.config.apiUrl();
    this.error.set('');
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }
}
