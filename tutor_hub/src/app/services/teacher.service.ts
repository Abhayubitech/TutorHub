import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  // Signals
  private profileSignal = signal<any>(null);
  private coursesSignal = signal<any[]>([]);
  private enrollmentRequestsSignal = signal<any[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  profile = computed(() => this.profileSignal());
  courses = computed(() => this.coursesSignal());
  enrollmentRequests = computed(() => this.enrollmentRequestsSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());
  courseCount = computed(() => this.coursesSignal().length);
  pendingRequests = computed(() => this.enrollmentRequestsSignal().length);

  constructor(private apiService: ApiService) {}

  loadProfile(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getTeacherProfile().subscribe({
      next: (response) => {
        if (response.success) {
          this.profileSignal.set(response.profile);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load profile');
        this.loadingSignal.set(false);
      }
    });
  }

  updateProfile(profileData: any): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.updateTeacherProfile(profileData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadProfile();
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to update profile');
        this.loadingSignal.set(false);
      }
    });
  }

  loadCourses(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getTeacherCourses().subscribe({
      next: (response) => {
        if (response.success) {
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

  createCourse(courseData: any): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.createCourse(courseData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadCourses();
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to create course');
        this.loadingSignal.set(false);
      }
    });
  }

  updateCourse(courseId: string, courseData: any): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.updateCourse(courseId, courseData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadCourses();
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to update course');
        this.loadingSignal.set(false);
      }
    });
  }

  deleteCourse(courseId: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.deleteCourse(courseId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadCourses();
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to delete course');
        this.loadingSignal.set(false);
      }
    });
  }

  loadEnrollmentRequests(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getEnrollmentRequests().subscribe({
      next: (response) => {
        if (response.success) {
          this.enrollmentRequestsSignal.set(response.requests);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load requests');
        this.loadingSignal.set(false);
      }
    });
  }

  handleRequest(requestId: string, action: 'approve' | 'reject'): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.handleEnrollmentRequest(requestId, action).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadEnrollmentRequests();
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to handle request');
        this.loadingSignal.set(false);
      }
    });
  }
}
