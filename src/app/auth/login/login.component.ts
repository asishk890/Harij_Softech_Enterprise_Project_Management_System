import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginError = false;

  loginForm = this.fb.group({
    email: ['admin@epms.com', [Validators.required, Validators.email]],
    password: ['password', [Validators.required]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: (user) => { 
        if (user) {
          this.router.navigate(['/dashboard']);
        } else {
          this.loginError = true;
        }
      },
      error: () => {
        this.loginError = true;
      }
    });
  }
}