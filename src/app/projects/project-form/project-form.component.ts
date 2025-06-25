
import { Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ProjectService } from '../project.service';
import { Project, ProjectStatus } from '../../core/models/project.model';
import { User } from '../../core/models/user.model'; 
import { switchMap, of, filter } from 'rxjs';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive], 
  templateUrl: './project-form.component.html',
})
export class ProjectFormComponent implements OnInit {

  private fb = inject(NonNullableFormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

 
  public projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    status: this.fb.control<ProjectStatus>('To Do', Validators.required),
    
    managerId: [0, Validators.required],
    team: this.fb.control<number[]>([], Validators.required),
  });

  public availableUsers: User[] = [];
  public projectStatuses: ProjectStatus[] = ['To Do', 'In Progress', 'Done'];
  private editingProjectId: number | null = null;
  public isEditMode = false;

  public isChildRouteActive = false;

  constructor() { 
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isChildRouteActive = this.route.firstChild !== null;
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
  
    this.availableUsers = [
      { id: 1, name: 'Admin User', email: 'admin@epms.com', role: 'Admin' },
      { id: 2, name: 'Manager Mike', email: 'manager@epms.com', role: 'Project Manager' },
      { id: 3, name: 'Developer Dave', email: 'dev@epms.com', role: 'Developer' }
    ];

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode = true;
          this.editingProjectId = +id;
          return this.projectService.getProjectById(this.editingProjectId);
        }
       
        return of(null);
      })
    ).subscribe(project => {
      if (project) {
       
        this.projectForm.patchValue(project);
      }
    });
  }

  public onSubmit(): void {
    if (this.projectForm.invalid) {
      
      this.projectForm.markAllAsTouched();
      return;
    }

    const projectData = this.projectForm.getRawValue();

    if (this.isEditMode && this.editingProjectId) {
     
      const projectToUpdate: Project = { ...projectData, id: this.editingProjectId };
      this.projectService.updateProject(projectToUpdate).subscribe(() => {
        this.router.navigate(['/projects']);
      });
    } else {
     
      this.projectService.createProject(projectData).subscribe(() => {
        this.router.navigate(['/projects']);
      });
    }
  }

  // Helper getters for easy access in the template
  get name() { return this.projectForm.get('name'); }
  get status() { return this.projectForm.get('status'); }
}