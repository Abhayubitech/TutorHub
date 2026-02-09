import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string | null;
  current_password?: string;
  new_password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor(private apiService: ApiService) {}

  updateUser(userData: UpdateUserData): Observable<any> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return new Observable(observer => {
      this.apiService.updateUserProfile('self', userData).subscribe({
        next: (response) => {
          this.loadingSignal.set(false);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.loadingSignal.set(false);
          this.errorSignal.set(error.error?.message || 'Failed to update user');
          observer.error(error);
        }
      });
    });
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
