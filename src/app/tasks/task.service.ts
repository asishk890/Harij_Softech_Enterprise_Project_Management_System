
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../app/environments/environment';
import { Task } from '../core/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getTasksForProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks?projectId=${projectId}`);
  }

  updateTaskStatus(taskId: number, status: Task['status']): Observable<Task> {
   
    return this.http.patch<Task>(`${this.apiUrl}/tasks/${taskId}`, { status });
  }
}