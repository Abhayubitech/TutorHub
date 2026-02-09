import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

export interface AccountSettingsData {
  name: string;
  email: string;
  phone: string | null;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit, OnDestroy {
  // Basic info signals
  name = signal<string>('');
  email = signal<string>('');
  phone = signal<string>('');
  
  // Password change signals
  currentPassword = signal<string>('');
  newPassword = signal<string>('');
  confirmPassword = signal<string>('');
  
  // UI state signals
  isLoading = signal<boolean>(false);
  showPasswordForm = signal<boolean>(false);
  showCurrentPassword = signal<boolean>(false);
  showNewPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  
  // Validation errors
  basicInfoErrors = signal<string[]>([]);
  passwordErrors = signal<string[]>([]);
  
  // Success messages
  basicInfoSuccess = signal<string>('');
  passwordSuccess = signal<string>('');

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private loadUserData(): void {
    const user = this.authService.user();
    if (user) {
      this.name.set(user.name || '');
      this.email.set(user.email || '');
      this.phone.set(user.phone || '');
    } else {
      // Redirect to login if no user data
      this.router.navigate(['/login']);
    }
  }

  // Basic info methods
  validateBasicInfo(): boolean {
    const errors: string[] = [];
    
    // Name validation
    const nameRegex = /^[a-zA-Z\s'-]*$/;
    if (!nameRegex.test(this.name().trim())) {
      errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
    }
    
    if (this.name().trim().length > 100) {
      errors.push('Name must not exceed 100 characters');
    }
    
    if (this.name().trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email().trim())) {
      errors.push('Please enter a valid email address');
    }
    
    // Phone validation (optional)
    if (this.phone().trim()) {
      const phoneRegex = /^[\d+\-\s()]*$/;
      if (!phoneRegex.test(this.phone().trim())) {
        errors.push('Phone can only contain numbers, spaces, hyphens, and parentheses');
      }
      
      if (this.phone().trim().length > 20) {
        errors.push('Phone must not exceed 20 characters');
      }
    }
    
    this.basicInfoErrors.set(errors);
    return errors.length === 0;
  }

  async updateBasicInfo(): Promise<void> {
    if (!this.validateBasicInfo()) {
      return;
    }
    
    this.isLoading.set(true);
    this.basicInfoSuccess.set('');
    
    try {
      const result = await new Promise<any>((resolve, reject) => {
        this.userService.updateUser({
          name: this.name().trim(),
          email: this.email().trim(),
          phone: this.phone().trim() || null
        }).subscribe({
          next: resolve,
          error: reject
        });
      });
      
      if (result.success) {
        // Update local user data
        this.authService.updateCurrentUser(result.user);
        this.basicInfoSuccess.set('Basic information updated successfully!');
      } else {
        this.basicInfoErrors.set([result.message || 'Failed to update basic information']);
      }
    } catch (error: any) {
      this.basicInfoErrors.set([error.message || 'An error occurred while updating basic information']);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Password methods
  validatePasswordForm(): boolean {
    const errors: string[] = [];
    
    if (!this.currentPassword()) {
      errors.push('Current password is required');
    }
    
    if (!this.newPassword()) {
      errors.push('New password is required');
    } else {
      if (this.newPassword().length < 6) {
        errors.push('New password must be at least 6 characters long');
      }
      
      if (this.newPassword().length > 100) {
        errors.push('New password must not exceed 100 characters');
      }
    }
    
    if (!this.confirmPassword()) {
      errors.push('Please confirm your new password');
    } else if (this.newPassword() !== this.confirmPassword()) {
      errors.push('New passwords do not match');
    }
    
    if (this.currentPassword() === this.newPassword()) {
      errors.push('New password must be different from current password');
    }
    
    this.passwordErrors.set(errors);
    return errors.length === 0;
  }

  async updatePassword(): Promise<void> {
    if (!this.validatePasswordForm()) {
      return;
    }
    
    this.isLoading.set(true);
    this.passwordSuccess.set('');
    
    try {
      const result = await new Promise<any>((resolve, reject) => {
        this.userService.updateUser({
          current_password: this.currentPassword(),
          new_password: this.newPassword()
        }).subscribe({
          next: resolve,
          error: reject
        });
      });
      
      if (result.success) {
        this.passwordSuccess.set('Password updated successfully!');
        // Clear password fields
        this.currentPassword.set('');
        this.newPassword.set('');
        this.confirmPassword.set('');
        this.showPasswordForm.set(false);
      } else {
        this.passwordErrors.set([result.message || 'Failed to update password']);
      }
    } catch (error: any) {
      this.passwordErrors.set([error.message || 'An error occurred while updating password']);
    } finally {
      this.isLoading.set(false);
    }
  }

  // UI helper methods
  togglePasswordForm(): void {
    this.showPasswordForm.update(prev => !prev);
    // Clear errors and fields when toggling
    this.passwordErrors.set([]);
    this.passwordSuccess.set('');
    if (!this.showPasswordForm()) {
      this.currentPassword.set('');
      this.newPassword.set('');
      this.confirmPassword.set('');
    }
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword.update(prev => !prev);
        break;
      case 'new':
        this.showNewPassword.update(prev => !prev);
        break;
      case 'confirm':
        this.showConfirmPassword.update(prev => !prev);
        break;
    }
  }

  clearBasicInfoErrors(): void {
    this.basicInfoErrors.set([]);
    this.basicInfoSuccess.set('');
  }

  clearPasswordErrors(): void {
    this.passwordErrors.set([]);
    this.passwordSuccess.set('');
  }

  // Getters
  get user() {
    return this.authService.user();
  }

  get isLoadingBasicInfo() {
    return this.isLoading() && !this.showPasswordForm();
  }

  get isLoadingPassword() {
    return this.isLoading() && this.showPasswordForm();
  }

  get memberSince(): string {
    const user = this.authService.user();
    if (user?.created_at) {
      return new Date(user.created_at).toLocaleDateString();
    }
    return 'Unknown';
  }
}
