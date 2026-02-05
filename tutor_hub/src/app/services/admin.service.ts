import { Injectable, signal, computed, isDevMode } from '@angular/core';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { Observable } from 'rxjs';

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

  updateUser(userId: string, userData: any): Observable<any> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.apiService.updateUserAdmin(userId, userData);
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
    
    console.log('Loading admin manage overview...');

    this.apiService.getAdminManageOverview(true).subscribe({  // Enable dummy data for development
      next: (response) => {
        console.log('Admin manage overview response:', response);
        if (response.success && response.manage) {
          console.log('Teacher courses:', response.manage.teacherCourses);
          console.log('Student enrollments:', response.manage.studentEnrollments);
          
          // Transform teacher courses data
          const transformedTeacherCourses = this.transformTeacherCourses(response.manage.teacherCourses || []);
          
          // Transform student enrollments data  
          const transformedStudentEnrollments = this.transformStudentEnrollments(response.manage.studentEnrollments || []);
          
          this.manageTeacherCoursesSignal.set(transformedTeacherCourses);
          this.manageStudentEnrollmentsSignal.set(transformedStudentEnrollments);
        } else {
          console.warn('Invalid response format:', response);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        console.error('Error loading manage overview:', error);
        this.errorSignal.set(error.error?.message || 'Failed to load manage overview');
        this.loadingSignal.set(false);
      }
    });
  }

  private transformTeacherCourses(data: any[]): any[] {
    const teacherMap = new Map();
    
    data.forEach(item => {
      const teacherId = item.teacher_id;
      if (!teacherMap.has(teacherId)) {
        teacherMap.set(teacherId, {
          teacherId,
          teacherName: item.teacher_name,
          teacherEmail: item.teacher_email,
          courses: []
        });
      }
      
      if (item.course_id && item.subject) {
        teacherMap.get(teacherId).courses.push({
          id: item.course_id,
          subject: item.subject,
          description: item.description,
          fee: item.fee,
          mode: item.mode,
          startDate: item.start_date,
          endDate: item.end_date,
          enrolledStudents: Math.floor(Math.random() * 20) + 1 // Random number for demo
        });
      }
    });
    
    return Array.from(teacherMap.values());
  }

  private transformStudentEnrollments(data: any[]): any[] {
    const studentMap = new Map();
    
    data.forEach(item => {
      const studentId = item.student_id;
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          studentId,
          studentName: item.student_name,
          studentEmail: item.student_email,
          enrollments: []
        });
      }
      
      if (item.course_id && item.subject) {
        studentMap.get(studentId).enrollments.push({
          id: item.course_id,
          subject: item.subject,
          mode: item.mode,
          fee: item.fee,
          teacherName: item.teacher_name,
          enrolledAt: item.enrolled_at,
          status: 'approved' // Default status for demo
        });
      }
    });
    
    return Array.from(studentMap.values());
  }
}
