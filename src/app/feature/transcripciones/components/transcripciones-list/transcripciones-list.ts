import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SpeechService } from '../../../../core/services/speech.service';
import { SpeechToText } from '../../../../core/interfaces/speech';

@Component({
  selector: 'app-transcripciones-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './transcripciones-list.html',
  styleUrl: './transcripciones-list.scss',
})
export class TranscripcionesListComponent implements OnInit {
  private readonly service = inject(SpeechService);

  records  = signal<SpeechToText[]>([]);
  loading  = signal(false);
  error    = signal('');
  filter   = signal<boolean | undefined>(undefined);
  selected = signal<SpeechToText | null>(null);

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
