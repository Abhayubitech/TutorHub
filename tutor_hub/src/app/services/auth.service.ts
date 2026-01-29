import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from './api.service';

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

  constructor(private apiService: ApiService) {
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
  }

  getRole(): string | null {
    const user = this.userSignal();
    return user?.role || null;
  }
}
