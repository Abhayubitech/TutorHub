import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';

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

  constructor(private apiService: ApiService, private toastService: ToastService) {
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.toastService.info('You have been logged out successfully');
  }

  logoutWithConfirmation(): void {
    if (confirm('Are you sure you want to logout? Any unsaved changes will be lost.')) {
      this.logout();
    }
  }

  logoutAndClearData(): void {
    if (confirm('Are you sure you want to logout? This will clear all local data and cache.')) {
      localStorage.clear();
      sessionStorage.clear();
      this.userSignal.set(null);
      this.isAuthenticatedSignal.set(false);
      this.toastService.warning('Logged out and all local data cleared');
    }
  }

  logoutToSpecificRole(role: 'student' | 'teacher' | 'admin'): void {
    if (confirm(`Are you sure you want to logout and switch to ${role} dashboard?`)) {
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
          localStorage.setItem('user', JSON.stringify(response.user));
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
}
