import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpeechService } from '../../../../core/services/speech.service';
import { SpeechToText } from '../../../../core/interfaces/speech';

const LANGUAGES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'Inglés' },
  { code: 'pt', label: 'Portugués' },
  { code: 'fr', label: 'Francés' },
  { code: 'de', label: 'Alemán' },
  { code: 'it', label: 'Italiano' },
  { code: 'ja', label: 'Japonés' },
  { code: 'zh', label: 'Chino' },
];

@Component({
  selector: 'app-transcripciones-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './transcripciones-form.html',
  styleUrl: './transcripciones-form.scss',
})
export class TranscripcionesFormComponent {
  private readonly service = inject(SpeechService);

  url       = '';
  lang      = '';
  languages = LANGUAGES;
  loading   = signal(false);
  error     = signal('');
  result    = signal<SpeechToText | null>(null);

  transcribir(): void {
    if (!this.url.trim() || !this.lang) return;
    this.loading.set(true);
    this.error.set('');
    this.result.set(null);

    this.service.transcribir(this.url.trim(), this.lang).subscribe({
      next: data => { this.result.set(data); this.loading.set(false); },
      error: () => { this.error.set('Error al transcribir. Verifica la URL y el backend.'); this.loading.set(false); },
    });
  }

  limpiar(): void {
    this.url = '';
    this.lang = '';
    this.result.set(null);
    this.error.set('');
  }
}
