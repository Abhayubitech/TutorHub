import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  token = signal<string>('');
  newPassword = signal<string>('');
  confirmPassword = signal<string>('');
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  message = signal<string>('');
  error = signal<string>('');
  showSuccess = signal<boolean>(false);
  tokenValid = signal<boolean>(true);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get token from URL parameters
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.token.set(token);
      } else {
        this.tokenValid.set(false);
        this.error.set('Invalid reset link. Please request a new password reset.');
      }
    });
  }

  async resetPassword(): Promise<void> {
    // Reset states
    this.message.set('');
    this.error.set('');
    this.showSuccess.set(false);

    // Validation
    if (!this.newPassword()) {
      this.error.set('Please enter a new password');
      return;
    }

    if (this.newPassword().length < 6) {
      this.error.set('Password must be at least 6 characters long');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.error.set('Passwords do not match');
      return;
    }

    this.isLoading.set(true);

    try {
      // Call backend API to reset password
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: this.token(),
          newPassword: this.newPassword()
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
        this.error.set(result.message || 'Failed to reset password');
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

  togglePasswordVisibility(): void {
    this.showPassword.update(prev => !prev);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(prev => !prev);
  }
}
