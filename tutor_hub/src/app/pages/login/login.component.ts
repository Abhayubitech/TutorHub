import { Component, signal, OnInit, OnDestroy } from '@angular/core';
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
export class LoginComponent implements OnInit, OnDestroy {
  email = signal<string>('');
  password = signal<string>('');
  showPassword = signal<boolean>(false);
  
  // Validation errors
  emailError = signal<string>('');
  passwordError = signal<string>('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // No need to hide footer anymore since we have auth footer
  }

  ngOnDestroy(): void {
    // No need to remove hide-footer class anymore
  }

  login(): void {
    // Clear previous errors
    this.emailError.set('');
    this.passwordError.set('');
    
    // Validate email
    if (!this.email()) {
      this.emailError.set('Email is required');
      return;
    }
    
    if (this.email().length > 33) {
      this.emailError.set('Email must be 33 characters or less');
      return;
    }
    
    // Additional email validation
    if (this.email().includes('..') || this.email().startsWith('.') || this.email().endsWith('.')) {
      this.emailError.set('Please enter a valid email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.emailError.set('Please enter a valid email address');
      return;
    }
    
    // Validate password
    if (!this.password()) {
      this.passwordError.set('Password is required');
      return;
    }
    
    if (this.password().length > 11) {
      this.passwordError.set('Password must be 11 characters or less');
      return;
    }
    
    if (this.password().length < 1) {
      this.passwordError.set('Password cannot be empty');
      return;
    }
    
    // All validations passed, proceed with login
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
