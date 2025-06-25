
import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent),
  },
 
  { path: '**', redirectTo: 'login' }
];