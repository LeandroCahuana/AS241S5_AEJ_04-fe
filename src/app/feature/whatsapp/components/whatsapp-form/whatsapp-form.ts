import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WhatsAppService } from '../../../../core/services/whatsapp.service';
import { WhatsApp } from '../../../../core/interfaces/whatsapp';

@Component({
  selector: 'app-whatsapp-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './whatsapp-form.html',
  styleUrl: './whatsapp-form.scss',
})
export class WhatsAppFormComponent {
  private readonly service = inject(WhatsAppService);

  numero = '';
  loading = signal(false);
  error   = signal('');
  result  = signal<WhatsApp | null>(null);

  validar(): void {
    if (!this.numero.trim()) return;
    this.loading.set(true);
    this.error.set('');
    this.result.set(null);

    this.service.validar(this.numero.trim()).subscribe({
      next: data => { this.result.set(data); this.loading.set(false); },
      error: () => { this.error.set('Error al verificar el número.'); this.loading.set(false); },
    });
  }

  limpiar(): void {
    this.numero = '';
    this.result.set(null);
    this.error.set('');
  }
}
