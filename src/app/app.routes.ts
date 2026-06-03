import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./feature/dashboard/pages/dashboard/dashboard').then(
            m => m.DashboardComponent,
          ),
      },
      {
        path: 'whatsapp',
        loadChildren: () =>
          import('./feature/whatsapp/whatsapp.routes').then(m => m.WHATSAPP_ROUTES),
      },
      {
        path: 'transcripciones',
        loadChildren: () =>
          import('./feature/transcripciones/transcripciones.routes').then(
            m => m.TRANSCRIPCIONES_ROUTES,
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./feature/settings/settings.routes').then(m => m.SETTINGS_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
