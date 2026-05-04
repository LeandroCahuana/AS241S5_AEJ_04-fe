import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { WhatsAppService } from '../../../../core/services/whatsapp.service';
import { WhatsApp } from '../../../../core/interfaces/whatsapp';

@Component({
  selector: 'app-whatsapp-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './whatsapp-list.html',
  styleUrl: './whatsapp-list.scss',
})
export class WhatsAppListComponent implements OnInit {
  private readonly service = inject(WhatsAppService);

  records = signal<WhatsApp[]>([]);
  loading = signal(false);
  error   = signal('');
  filter  = signal<boolean | undefined>(undefined);

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

  revalidar(id: string): void {
    this.service.revalidar(id).subscribe({
      next: updated => this.records.update(list => list.map(r => r.id === id ? updated : r)),
      error: () => this.error.set('Error al revalidar el número.'),
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
