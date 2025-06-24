
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../app/environments/environment'; 
import { User, UserRole } from '../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  currentUser = signal<User | null | undefined>(undefined);

  constructor() {
    const userJson = localStorage.getItem('epms_user');
    if (userJson) {
      this.currentUser.set(JSON.parse(userJson));
    } else {
      this.currentUser.set(null);
    }
  }

  login(credentials: { email: string, password: string }): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${credentials.email}&password=${credentials.password}`).pipe(
   
      map(users => users[0] || null),
      tap(user => {
        if (user) {
          const userWithToken = { ...user, token: btoa(`${user.email}:${new Date().getTime()}`) };
          localStorage.setItem('epms_user', JSON.stringify(userWithToken));
          this.currentUser.set(userWithToken);
        } else {
          localStorage.removeItem('epms_user');
          this.currentUser.set(null);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('epms_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }
}