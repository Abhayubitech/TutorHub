import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  get user() {
    return this.authService.user();
  }

  navigateToDashboard(): void {
    const user = this.authService.user();
    if (user) {
      const route = user.role === 'teacher' ? '/teacher' : user.role === 'admin' ? '/admin' : '/student';
      this.router.navigate([route]);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
