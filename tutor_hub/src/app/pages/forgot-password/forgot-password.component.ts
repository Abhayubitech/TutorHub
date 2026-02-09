import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email = signal<string>('');
  isLoading = signal<boolean>(false);
  message = signal<string>('');
  error = signal<string>('');
  showSuccess = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async sendResetLink(): Promise<void> {
    // Reset states
    this.message.set('');
    this.error.set('');
    this.showSuccess.set(false);

    // Validation
    if (!this.email() || !this.isValidEmail(this.email())) {
      this.error.set('Please enter a valid email address');
      return;
    }

    this.isLoading.set(true);

    try {
      // Call real backend API
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.email()
        })
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccess.set(true);
        this.message.set(result.message);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      } else {
        this.error.set(result.message || 'Failed to send reset link');
      }
      
    } catch (error) {
      this.error.set('Network error. Please try again.');
      console.error('Password reset error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
