
import { Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UserService, UserCreationData } from '../user.service';
import { User, UserRole } from '../../core/models/user.model';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
 
  private fb = inject(NonNullableFormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: this.fb.control<UserRole>('Developer', Validators.required),
  });

  public availableRoles: UserRole[] = ['Admin', 'Project Manager', 'Developer'];
  private editingUserId: number | null = null;
  public isEditMode = false;

  ngOnInit(): void {
    this.route.paramMap.pipe(
        switchMap(params => {
          const id = params.get('id');
          if (id) {
            this.isEditMode = true;
            this.editingUserId = +id;
            return this.userService.getUserById(this.editingUserId);
          }
          return of(null);
        })
      ).subscribe(user => {
        if (user) {
          this.userForm.patchValue(user);
        }
      });
  }

  public onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    const formValue = this.userForm.getRawValue();

    if (this.isEditMode && this.editingUserId) {
    
      const userToUpdate: Omit<User, 'password' | 'token'> = { ...formValue, id: this.editingUserId };
      this.userService.updateUser(userToUpdate).subscribe(() => this.router.navigate(['/users']));
    } else {
      
      const userToCreate: UserCreationData = { ...formValue }; 
      this.userService.createUser(userToCreate).subscribe(() => this.router.navigate(['/users']));
    }
  }

  get name() { return this.userForm.get('name'); }
  get email() { return this.userForm.get('email'); }
}