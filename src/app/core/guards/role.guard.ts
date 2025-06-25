
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserRole } from '../models/user.model';

export function roleGuard(requiredRole: UserRole): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

   
    if (authService.currentUser()?.role === requiredRole) {
      return true;
    }

    return router.parseUrl('/dashboard');
  };
}