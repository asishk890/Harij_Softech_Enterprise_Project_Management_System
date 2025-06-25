import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
 
  public isSidebarOpen = signal(false);

  private authService = inject(AuthService);
  public readonly currentUser = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}