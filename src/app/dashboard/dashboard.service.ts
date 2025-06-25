
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../app/environments/environment';
import { Project } from '../../app/core/models/project.model'; 
import { User } from '../core/models/user.model';
import { Task } from '../../app/core/models/task.model'; 
import { DashboardData, ChartData } from './dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

 
  private projects$ = this.http.get<Project[]>(`${this.apiUrl}/projects`);
  private users$ = this.http.get<User[]>(`${this.apiUrl}/users`);
  private tasks$ = this.http.get<Task[]>(`${this.apiUrl}/tasks`);

  getDashboardData(): Observable<DashboardData> {
    return forkJoin({
      projects: this.projects$,
      users: this.users$,
      tasks: this.tasks$,
    }).pipe(
      map(({ projects, users, tasks }) => {
        
        const kpis = {
          projectCount: projects.length,
          activeUsers: users.length, 
          overdueTasks: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Done').length,
        };

       
        const projectsByStatus = this.processByStatus(projects);
        const tasksByPriority = this.processByPriority(tasks);

        
        return { kpis, projectsByStatus, tasksByPriority };
      })
    );
  }

  private processByStatus(projects: Project[]): ChartData[] {
    const statusCounts = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }

  private processByPriority(tasks: Task[]): ChartData[] {
    const priorityCounts = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));
  }
}