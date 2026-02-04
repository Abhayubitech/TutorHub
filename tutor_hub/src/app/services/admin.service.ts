import { Injectable, signal, computed, isDevMode } from '@angular/core';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Signals
  private usersSignal = signal<any[]>([]);
  private recentUsersSignal = signal<any[]>([]);
  private coursesSignal = signal<any[]>([]);
  private manageTeacherCoursesSignal = signal<any[]>([]);
  private manageStudentEnrollmentsSignal = signal<any[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  users = computed(() => this.usersSignal());
  recentUsers = computed(() => this.recentUsersSignal());
  courses = computed(() => this.coursesSignal());
  manageTeacherCourses = computed(() => this.manageTeacherCoursesSignal());
  manageStudentEnrollments = computed(() => this.manageStudentEnrollmentsSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());

  totalUsers = computed(() => this.usersSignal().length);
  studentCount = computed(() => this.usersSignal().filter(u => u.role === 'student').length);
  teacherCount = computed(() => this.usersSignal().filter(u => u.role === 'teacher').length);
  courseCount = computed(() => this.coursesSignal().length);

  constructor(private apiService: ApiService, private toastService: ToastService) {}

  loadAllUsers(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getAllUsers(false).subscribe({
      next: (response) => {
        if (response.success && response.users) {
          this.usersSignal.set(response.users);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load users');
        this.loadingSignal.set(false);
      }
    });
  }

  loadUsersByRole(role: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getUsersByRole(role, false).subscribe({
      next: (response) => {
        if (response.success && response.users) {
          this.usersSignal.set(response.users);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load users');
        this.loadingSignal.set(false);
      }
    });
  }

  loadRecentUsers(limit: number = 10): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getRecentUsers(limit, false).subscribe({
      next: (response) => {
        if (response.success && response.users) {
          this.recentUsersSignal.set(response.users);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load recent users');
        this.loadingSignal.set(false);
      }
    });
  }

  deleteUser(userId: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.deleteUserAdmin(userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadAllUsers();
          this.toastService.success('User deleted successfully');
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to delete user');
        this.toastService.error('Error: ' + (error.error?.message || 'Failed to delete user'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateUser(userId: string, userData: any): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.updateUserAdmin(userId, userData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadAllUsers();
          this.toastService.success('User updated successfully');
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to update user');
        this.toastService.error('Error: ' + (error.error?.message || 'Failed to update user'));
        this.loadingSignal.set(false);
      }
    });
  }

  loadCourses(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getAllCoursesAdmin(false).subscribe({
      next: (response) => {
        if (response.success && response.courses) {
          this.coursesSignal.set(response.courses);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load courses');
        this.loadingSignal.set(false);
      }
    });
  }

  loadManageOverview(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getAdminManageOverview(false).subscribe({
      next: (response) => {
        if (response.success && response.manage) {
          this.manageTeacherCoursesSignal.set(response.manage.teacherCourses || []);
          this.manageStudentEnrollmentsSignal.set(response.manage.studentEnrollments || []);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load manage overview');
        this.loadingSignal.set(false);
      }
    });
  }
}
