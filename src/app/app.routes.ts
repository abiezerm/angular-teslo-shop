import { Routes } from '@angular/router';
import { UnauthenticatedGuard } from '@core/auth/guards/unauthenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes'),
    canMatch: [
      UnauthenticatedGuard,
    ]
  },
  { path: '', loadChildren: () =>  import('./modules/store-front/store-front.routes') },
];
