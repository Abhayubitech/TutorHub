import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  // Signals
  private allCoursesSignal = signal<any[]>([]);
  private myEnrollmentsSignal = signal<any[]>([]);
  private myRequestsSignal = signal<any[]>([]);
  private allTeachersSignal = signal<any[]>([]);
  private searchResultsSignal = signal<any[]>([]);
  private teacherSearchResultsSignal = signal<any[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  allCourses = computed(() => this.allCoursesSignal());
  myEnrollments = computed(() => this.myEnrollmentsSignal());
  myRequests = computed(() => this.myRequestsSignal());
  allTeachers = computed(() => this.allTeachersSignal());
  searchResults = computed(() => this.searchResultsSignal());
  teacherSearchResults = computed(() => this.teacherSearchResultsSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());
  enrollmentCount = computed(() => this.myEnrollmentsSignal().length);

  constructor(private apiService: ApiService, private http: HttpClient) {}

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

  requestEnrollment(courseId: string): Observable<any> {
    return this.apiService.requestEnrollment(courseId);
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

  // Teacher search methods
  searchTeachers(query: string): void {
    if (query.trim().length < 2) {
      this.teacherSearchResultsSignal.set([]);
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Perform client-side search for teachers
    this.performTeacherClientSideSearch(query);
    this.loadingSignal.set(false);
  }

  private performTeacherClientSideSearch(query: string): void {
    const allTeachers = this.allTeachersSignal();
    const filteredTeachers = allTeachers.filter(teacher => 
      teacher.name?.toLowerCase().includes(query.toLowerCase()) ||
      teacher.qualification?.toLowerCase().includes(query.toLowerCase()) ||
      teacher.bio?.toLowerCase().includes(query.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(query.toLowerCase())
    );
    this.teacherSearchResultsSignal.set(filteredTeachers);
  }

  clearTeacherSearchResults(): void {
    this.teacherSearchResultsSignal.set([]);
  }

  refreshTeachers(): void {
    this.loadAllTeachers();
  }

  // WhatsApp and payment methods
  getWhatsAppGroup(courseId: string, groupType: 'demo' | 'approved' = 'demo'): Observable<any> {
    return this.apiService.get(`/courses/whatsapp-group/${courseId}?groupType=${groupType}`);
  }

  uploadPaymentScreenshot(courseId: string, file: File, paymentData: any): Observable<any> {
    const formData = new FormData();
    formData.append('screenshot', file);
    formData.append('courseId', courseId);
    formData.append('paymentAmount', paymentData.paymentAmount || '');
    formData.append('paymentDate', paymentData.paymentDate || '');
    formData.append('upiTransactionId', paymentData.upiTransactionId || '');
    
    return this.apiService.uploadPaymentScreenshot(courseId, formData);
  }

  getPaymentStatus(courseId: string): Observable<any> {
    return this.apiService.getStudentPaymentStatus(courseId);
  }
}
