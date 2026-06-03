import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { WhatsAppService } from '../../../../core/services/whatsapp.service';
import { SpeechService } from '../../../../core/services/speech.service';
import { WhatsApp } from '../../../../core/interfaces/whatsapp';
import { SpeechToText } from '../../../../core/interfaces/speech';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private readonly waService = inject(WhatsAppService);
  private readonly stService = inject(SpeechService);

  private waAll = signal<WhatsApp[]>([]);
  private stAll = signal<SpeechToText[]>([]);

  private oneMonthAgo = new Date();

  private waMonth = computed(() =>
    this.waAll().filter(r => new Date(r.createdAt) >= this.oneMonthAgo),
  );

  private stMonth = computed(() =>
    this.stAll().filter(r => new Date(r.createdAt) >= this.oneMonthAgo),
  );

  waTotal   = computed(() => this.waMonth().length);
  waValid   = computed(() => this.waMonth().filter(r => r.valid).length);
  waActive  = computed(() => this.waAll().filter(r => r.active).length);
  waInactive = computed(() => this.waAll().filter(r => !r.active).length);
  waRecent  = computed(() => [...this.waAll()].slice(0, 5));

  stTotal   = computed(() => this.stMonth().length);
  stLangs   = computed(() => new Set(this.stMonth().map(r => r.lang)).size);
  stActive  = computed(() => this.stAll().filter(r => r.active).length);
  stInactive = computed(() => this.stAll().filter(r => !r.active).length);
  stRecent  = computed(() => [...this.stAll()].slice(0, 5));

  ngOnInit(): void {
    this.oneMonthAgo.setMonth(this.oneMonthAgo.getMonth() - 1);

    this.waService.listar().subscribe({
      next: data => this.waAll.set(data),
      error: () => this.waAll.set([]),
    });

    this.stService.listar().subscribe({
      next: data => this.stAll.set(data),
      error: () => this.stAll.set([]),
    });
  }
}
