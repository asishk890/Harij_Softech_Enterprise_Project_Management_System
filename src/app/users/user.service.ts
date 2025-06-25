
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../app/environments/environment';
import { User } from '../core/models/user.model';

export type UserCreationData = Omit<User, 'id' | 'token'> & { password?: string };

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(userData: UserCreationData): Observable<User> {

    const userPayload = { ...userData, password: userData.password || 'password' };
    return this.http.post<User>(this.apiUrl, userPayload);
  }


  updateUser(userData: Omit<User, 'password' | 'token'>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userData.id}`, userData);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}