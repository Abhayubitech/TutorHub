import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = signal<string>('');
  password = signal<string>('');
  showPassword = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    if (this.email() && this.password()) {
      this.authService.login(this.email(), this.password());

      // Redirect after successful login
      setTimeout(() => {
        const user = this.authService.user();
        if (user) {
          const route = user.role === 'teacher' ? '/teacher' : user.role === 'admin' ? '/admin' : '/student';
          this.router.navigate([route]);
        }
      }, 1000);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(prev => !prev);
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  onDemoChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    // quick demo credentials
    if (value === 'admin') {
      this.email.set('admin@example.com');
      this.password.set('adminpass');
    } else if (value === 'teacher') {
      this.email.set('teacher1@example.com');
      this.password.set('teacherpass');
    } else if (value === 'student') {
      this.email.set('student1@example.com');
      this.password.set('studentpass');
    }
  }

  get isLoading() {
    return this.authService.loading();
  }

  get error() {
    return this.authService.error();
  }
}
