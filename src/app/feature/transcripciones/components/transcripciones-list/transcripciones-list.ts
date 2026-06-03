import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-transcripciones-list',
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './transcripciones-list.html',
  styleUrl: './transcripciones-list.scss',
})
export class TranscripcionesListComponent implements OnInit {
  private readonly service = inject(SpeechService);

  records   = signal<SpeechToText[]>([]);
  loading   = signal(false);
  error     = signal('');
  filter    = signal<boolean | undefined>(undefined);
  selected  = signal<SpeechToText | null>(null);

  // Modal de edición
  languages   = LANGUAGES;
  editing     = signal<SpeechToText | null>(null);
  editUrl     = '';
  editLang    = '';
  editLoading = signal(false);
  editError   = signal('');

  ngOnInit(): void {
    this.load();
  }

  setFilter(value: boolean | undefined): void {
    this.filter.set(value);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.listar(this.filter()).subscribe({
      next: data => { this.records.set(data); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar los registros.'); this.loading.set(false); },
    });
  }

  verDetalle(item: SpeechToText): void {
    this.selected.set(item);
  }

  abrirEdicion(item: SpeechToText): void {
    this.editUrl  = item.url;
    this.editLang = item.lang;
    this.editError.set('');
    this.editing.set(item);
  }

  cerrarEdicion(): void {
    this.editing.set(null);
    this.editUrl  = '';
    this.editLang = '';
    this.editError.set('');
  }

  guardarEdicion(): void {
    const item = this.editing();
    if (!item || !this.editUrl.trim() || !this.editLang) return;
    this.editLoading.set(true);
    this.editError.set('');
    this.service.actualizar(item.id, this.editUrl.trim(), this.editLang).subscribe({
      next: updated => {
        this.records.update(list => list.map(r => r.id === item.id ? updated : r));
        this.editLoading.set(false);
        this.cerrarEdicion();
      },
      error: () => {
        this.editError.set('Error al actualizar la transcripción.');
        this.editLoading.set(false);
      },
    });
  }

  eliminar(id: string): void {
    this.service.eliminar(id).subscribe({
      next: updated => this.records.update(list => list.map(r => r.id === id ? updated : r)),
      error: () => this.error.set('Error al eliminar el registro.'),
    });
  }

  restaurar(id: string): void {
    this.service.restaurar(id).subscribe({
      next: updated => this.records.update(list => list.map(r => r.id === id ? updated : r)),
      error: () => this.error.set('Error al restaurar el registro.'),
    });
  }
}
