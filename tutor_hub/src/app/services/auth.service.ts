import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { ConfirmationService } from '../shared/services/confirmation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals
  private userSignal = signal<any>(null);
  private isAuthenticatedSignal = signal<boolean>(false);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  user = computed(() => this.userSignal());
  isAuthenticated = computed(() => this.isAuthenticatedSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());

  constructor(private apiService: ApiService, private toastService: ToastService, private confirmationService: ConfirmationService) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.userSignal.set(JSON.parse(user));
      this.isAuthenticatedSignal.set(true);
    }
  }

  login(email: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.login(email, password).subscribe({
      next: (response) => {
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.userSignal.set(response.user);
          this.isAuthenticatedSignal.set(true);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Login failed');
        this.loadingSignal.set(false);
      }
    });
  }

  signup(name: string, email: string, password: string, role: string, phone?: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.signup(name, email, password, role, phone).subscribe({
      next: (response) => {
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.userSignal.set(response.user);
          this.isAuthenticatedSignal.set(true);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Signup failed');
        this.loadingSignal.set(false);
      }
    });
  }

  logout(): void {
    try {
      console.log('Starting logout process...');
      
      // Clear all authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      console.log('Cleared local storage and session storage');
      
      // Reset signals
      this.userSignal.set(null);
      this.isAuthenticatedSignal.set(false);
      this.loadingSignal.set(false);
      this.errorSignal.set(null);
      
      console.log('Reset auth signals');
      
      this.toastService.info('You have been logged out successfully', 5000);
      console.log('Logout completed successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      this.userSignal.set(null);
      this.isAuthenticatedSignal.set(false);
      this.toastService.warning('Logged out with some issues');
    }
  }

  async logoutWithConfirmation(): Promise<void> {
    try {
      console.log('Starting logout confirmation...');
      const confirmed = await this.confirmationService.confirm({
        title: 'Confirm Logout',
        message: 'Are you sure you want to logout? Any unsaved changes will be lost.',
        confirmText: 'Logout',
        cancelText: 'Cancel',
        type: 'warning'
      });
      
      console.log('Confirmation result:', confirmed);
      
      if (confirmed) {
        console.log('User confirmed logout, proceeding...');
        this.logout();
      } else {
        console.log('User cancelled logout');
      }
    } catch (error) {
      console.error('Error during logout confirmation:', error);
      // Fallback: logout without confirmation
      this.logout();
    }
  }

  async logoutAndClearData(): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      title: 'Clear All Data',
      message: 'Are you sure you want to logout? This will clear all local data and cache.',
      confirmText: 'Clear & Logout',
      cancelText: 'Cancel',
      type: 'danger'
    });
    
    if (confirmed) {
      localStorage.clear();
      sessionStorage.clear();
      this.userSignal.set(null);
      this.isAuthenticatedSignal.set(false);
      this.toastService.warning('Logged out and all local data cleared');
    }
  }

  async logoutToSpecificRole(role: 'student' | 'teacher' | 'admin'): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      title: 'Switch Role',
      message: `Are you sure you want to logout and switch to ${role} dashboard?`,
      confirmText: `Switch to ${role}`,
      cancelText: 'Cancel',
      type: 'info'
    });
    
    if (confirmed) {
      this.logout();
      // Additional logic for role switching can be added here
      this.toastService.info(`Logged out. You can now login as ${role}`);
    }
  }

  updateUserProfile(profileData: any): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const userId = this.userSignal()?.id;
    if (!userId) {
      this.errorSignal.set('User not found');
      this.loadingSignal.set(false);
      return;
    }

    this.apiService.updateUserProfile(userId, profileData).subscribe({
      next: (response) => {
        if (response.success && response.user) {
          // Update localStorage immediately
          localStorage.setItem('user', JSON.stringify(response.user));
          // Update the user signal to trigger UI updates
          this.userSignal.set(response.user);
          this.toastService.success('Profile updated successfully');
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to update profile');
        this.toastService.error('Error: ' + (error.error?.message || 'Failed to update profile'));
        this.loadingSignal.set(false);
      }
    });
  }

  getRole(): string | null {
    const user = this.userSignal();
    return user?.role || null;
  }

  updateCurrentUser(updatedUser: any): void {
    this.userSignal.set(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
}
