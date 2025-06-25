
import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-list/user-list.component').then(m => m.UserListComponent),
    title: 'User Management'
  },
  {
    path: 'new',
    loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent),
    title: 'Create User'
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent),
    title: 'Edit User'
  }
];