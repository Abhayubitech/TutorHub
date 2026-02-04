import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  mobileMenuOpen = signal<boolean>(false);

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

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  goToHome(): void {
    this.closeMobileMenu();
    this.router.navigate(['/home']);
  }

  goToLogin(): void {
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }

  goToSignup(): void {
    this.closeMobileMenu();
    this.router.navigate(['/signup']);
  }

  navigateToDashboard(): void {
    this.closeMobileMenu();
    const user = this.authService.user();
    if (user) {
      const route = user.role === 'teacher' ? '/teacher' : user.role === 'admin' ? '/admin' : '/student';
      this.router.navigate([route]);
    }
  }

  logout(): void {
    this.closeMobileMenu();
    this.authService.logout();
    // Force navigation after a short delay to ensure auth state is updated
    setTimeout(() => {
      this.router.navigate(['/home']).catch(err => {
        console.error('Navigation error during logout:', err);
        // Fallback navigation
        window.location.href = '/home';
      });
    }, 100);
  }
}
