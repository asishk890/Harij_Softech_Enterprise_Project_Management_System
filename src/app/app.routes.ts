
import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
        title: 'Dashboard'
      },
      { 
        path: 'projects',
    
        loadChildren: () => import('./projects/projects.routes').then(r => r.PROJECT_ROUTES),
      },
     
    ]
  },
   {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
     
      {
        path: 'users',
        loadChildren: () => import('./users/users.routes').then(r => r.USER_ROUTES),
       
        canActivate: [roleGuard('Admin')]
      },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
