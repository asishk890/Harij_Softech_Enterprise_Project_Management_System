
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
  {
    path: 'edit/:id',
    loadComponent: () => import('./project-form/project-form.component').then(m => m.ProjectFormComponent),
    title: 'Edit Project',
    children: [ 
      {
        path: 'tasks',
        loadComponent: () => import('../tasks/task-board/task-board.component').then(m => m.TaskBoardComponent),
        title: 'Task Board'
      }
    ]
  }
];