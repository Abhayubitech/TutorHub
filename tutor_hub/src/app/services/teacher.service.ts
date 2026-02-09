import { Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
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

  createCourse(courseData: any): Observable<any> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const observable = this.apiService.createCourse(courseData);
    
    // Subscribe to automatically reload courses after successful creation
    observable.subscribe({
      next: (response) => {
        if (response.success) {
          // Automatically reload courses to update the list
          this.loadCourses();
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to create course');
        this.loadingSignal.set(false);
      }
    });
    
    return observable;
  }

  updateCourse(courseId: string, courseData: any): Observable<any> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const observable = this.apiService.updateCourse(courseId, courseData);
    
    // Subscribe to automatically reload courses after successful update
    observable.subscribe({
      next: (response) => {
        if (response.success) {
          // Automatically reload courses to update the list
          this.loadCourses();
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to update course');
        this.loadingSignal.set(false);
      }
    });
    
    return observable;
  }

  getCourseById(courseId: string): Observable<any> {
    return this.apiService.get(`/teacher/courses/${courseId}`);
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

  handleEnrollmentRequest(requestId: string, action: 'approve' | 'reject'): void {
    this.handleRequest(requestId, action);
  }

  // WhatsApp group methods
  createWhatsAppGroup(groupData: any): Observable<any> {
    return this.apiService.post('/teacher/whatsapp/groups', groupData);
  }

  updateWhatsAppGroup(courseId: string, groupType: 'demo' | 'approved', groupData: any): Observable<any> {
    return this.apiService.put(`/teacher/whatsapp/groups/${courseId}`, { groupType, ...groupData });
  }

  getWhatsAppGroups(courseId: string) {
    return this.apiService.get(`/teacher/whatsapp/groups/${courseId}`);
  }

  // Payment verification methods
  loadEnrolledStudents(courseId: string): Observable<any> {
    return this.apiService.get(`/teacher/enrolled-students/${courseId}`);
  }

  getPaymentVerifications(courseId: string): Observable<any> {
    return this.apiService.get(`/teacher/payment-verifications/${courseId}`);
  }

  updatePaymentVerification(verificationId: string, status: string, teacherNotes: string) {
    return this.apiService.put(`/teacher/payment-verifications/${verificationId}`, {
      status,
      teacherNotes
    });
  }

  uploadPaymentScreenshot(courseId: string, file: File, paymentData: any) {
    const formData = new FormData();
    formData.append('screenshot', file);
    formData.append('courseId', courseId);
    formData.append('paymentAmount', paymentData.paymentAmount || '');
    formData.append('paymentDate', paymentData.paymentDate || '');
    formData.append('upiTransactionId', paymentData.upiTransactionId || '');
    
    return this.apiService.uploadPaymentScreenshot(courseId, formData);
  }
}
