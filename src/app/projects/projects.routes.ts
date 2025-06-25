
import { Routes } from '@angular/router';

export const PROJECT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./project-list/project-list.component').then(m => m.ProjectListComponent),
    title: 'Project Management'
  },
  {
    path: 'new',
    loadComponent: () => import('./project-form/project-form.component').then(m => m.ProjectFormComponent),
    title: 'Create Project'
  },

];