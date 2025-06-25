
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  private userService = inject(UserService);
  public users = toSignal(this.userService.getUsers(), { initialValue: [] });

  public deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
       
        this.users = toSignal(this.userService.getUsers(), { initialValue: [] });
      });
    }
  }
}