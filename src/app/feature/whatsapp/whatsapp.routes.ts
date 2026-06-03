import { Routes } from '@angular/router';

export const WHATSAPP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/whatsapp-list/whatsapp-list').then(m => m.WhatsAppListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/whatsapp-form/whatsapp-form').then(m => m.WhatsAppFormComponent),
  },
];
