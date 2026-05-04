import { Routes } from '@angular/router';

export const TRANSCRIPCIONES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/transcripciones-list/transcripciones-list').then(
        m => m.TranscripcionesListComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/transcripciones-form/transcripciones-form').then(
        m => m.TranscripcionesFormComponent,
      ),
  },
];
