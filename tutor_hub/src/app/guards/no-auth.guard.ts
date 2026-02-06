import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // User is already authenticated, redirect to appropriate dashboard
      const user = this.authService.user();
      if (user?.role === 'teacher') {
        this.router.navigate(['/teacher']);
      } else if (user?.role === 'student') {
        this.router.navigate(['/student']);
      } else if (user?.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/home']);
      }
      return false;
    } else {
      // User is not authenticated, allow access to login/signup
      return true;
    }
  }
}
