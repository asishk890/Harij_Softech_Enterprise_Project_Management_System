
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../app/environments/environment';
import { Project } from '../core/models/project.model';

export interface ProjectsResponse {
  projects: Project[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;

  
  getProjects(
    page: number,
    limit: number,
    sortColumn: string,
    sortDirection: 'asc' | 'desc',
    searchTerm: string | null
  ): Observable<ProjectsResponse> {
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString())
      .set('_sort', sortColumn)
      .set('_order', sortDirection);

    if (searchTerm) {
      params = params.set('q', searchTerm);
    }

  
    return this.http.get<Project[]>(this.apiUrl, { params, observe: 'response' }).pipe(
      map((response: HttpResponse<Project[]>) => {
        // json-server sends total count in 'X-Total-Count' header
        const totalCount = Number(response.headers.get('X-Total-Count') || 0);
        const projects = response.body || [];
        return { projects, totalCount };
      })
    );
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  // Use `Omit` for type safety: the client doesn't create the 'id'
  createProject(projectData: Omit<Project, 'id'>): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, projectData);
  }

  updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${project.id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}