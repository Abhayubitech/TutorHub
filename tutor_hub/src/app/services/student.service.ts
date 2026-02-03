import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  // Signals
  private allCoursesSignal = signal<any[]>([]);
  private myEnrollmentsSignal = signal<any[]>([]);
  private myRequestsSignal = signal<any[]>([]);
  private allTeachersSignal = signal<any[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private searchResultsSignal = signal<any[]>([]);

  // Computed signals
  allCourses = computed(() => this.allCoursesSignal());
  myEnrollments = computed(() => this.myEnrollmentsSignal());
  myRequests = computed(() => this.myRequestsSignal());
  allTeachers = computed(() => this.allTeachersSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());
  searchResults = computed(() => this.searchResultsSignal());
  enrollmentCount = computed(() => this.myEnrollmentsSignal().length);

  constructor(private apiService: ApiService) {}

  loadAllCourses(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getAllCourses().subscribe({
      next: (response) => {
        if (response.success) {
          this.allCoursesSignal.set(response.courses);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load courses');
        this.loadingSignal.set(false);
      }
    });
  }

  loadMyEnrollments(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getMyEnrollments().subscribe({
      next: (response) => {
        if (response.success) {
          this.myEnrollmentsSignal.set(response.courses);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load enrollments');
        this.loadingSignal.set(false);
      }
    });
  }

  loadMyRequests(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getMyRequests().subscribe({
      next: (response) => {
        if (response.success) {
          this.myRequestsSignal.set(response.requests);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load requests');
        this.loadingSignal.set(false);
      }
    });
  }

  loadAllTeachers(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getAllTeachers().subscribe({
      next: (response) => {
        if (response.success) {
          this.allTeachersSignal.set(response.teachers);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load teachers');
        this.loadingSignal.set(false);
      }
    });
  }

  requestEnrollment(courseId: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.requestEnrollment(courseId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadMyRequests();
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to request enrollment');
        this.loadingSignal.set(false);
      }
    });
  }

  cancelRequest(requestId: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.cancelRequest(requestId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadMyRequests();
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to cancel request');
        this.loadingSignal.set(false);
      }
    });
  }

  refreshCourses(): void {
    this.loadAllCourses();
  }

  searchCourses(query: string): void {
    if (query.trim().length < 2) {
      this.searchResultsSignal.set([]);
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Try API search first
    this.apiService.searchCourses(query).subscribe({
      next: (response) => {
        if (response.success && response.courses) {
          this.searchResultsSignal.set(response.courses);
        } else {
          // Fallback to client-side search if API doesn't return expected format
          this.performClientSideSearch(query);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        console.warn('API search failed, falling back to client-side search:', error);
        // Fallback to client-side search
        this.performClientSideSearch(query);
        this.loadingSignal.set(false);
      }
    });
  }

  private performClientSideSearch(query: string): void {
    const allCourses = this.allCoursesSignal();
    const filteredCourses = allCourses.filter(course => 
      course.subject?.toLowerCase().includes(query.toLowerCase()) ||
      course.description?.toLowerCase().includes(query.toLowerCase()) ||
      course.teacher_name?.toLowerCase().includes(query.toLowerCase()) ||
      course.mode?.toLowerCase().includes(query.toLowerCase())
    );
    this.searchResultsSignal.set(filteredCourses);
  }

  clearSearchResults(): void {
    this.searchResultsSignal.set([]);
  }
}
