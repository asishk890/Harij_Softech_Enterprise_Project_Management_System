
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectService, ProjectsResponse } from '../project.service';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-list.component.html',
})
export class ProjectListComponent {
  private projectService = inject(ProjectService);

 
  public projects = signal<Project[]>([]);
  public totalCount = signal(0);
  public currentPage = signal(1);
  public pageSize = signal(10);
  public sortColumn = signal('name');
  public sortDirection = signal<'asc' | 'desc'>('asc');
  public searchTerm = signal('');

  public totalPages = () => Math.ceil(this.totalCount() / this.pageSize());

  constructor() {
  
    effect(() => {
      this.loadProjects();
    });
  }

  private loadProjects(): void {
    this.projectService.getProjects(
      this.currentPage(),
      this.pageSize(),
      this.sortColumn(),
      this.sortDirection(),
      this.searchTerm() || null // Pass null if search term is empty
    ).subscribe((response: ProjectsResponse) => {
      this.projects.set(response.projects);
      this.totalCount.set(response.totalCount);
    });
  }

  public onSort(column: string): void {
    if (this.sortColumn() === column) {
      
      this.sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
    } else {
   
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  
  public onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
  }

  public onPageChange(newPage: number): void {
    if (newPage > 0 && newPage <= this.totalPages()) {
      this.currentPage.set(newPage);
    }
  }

  public deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe(() => {
        // Refresh the project list after deletion
        this.loadProjects();
      });
    }
  }
}