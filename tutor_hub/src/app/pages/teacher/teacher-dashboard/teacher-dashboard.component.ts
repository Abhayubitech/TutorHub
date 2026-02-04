import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TeacherService } from '../../../services/teacher.service';
import { ToastService } from '../../../services/toast.service';
import { StatsGridComponent, StatItem } from '../../../shared/components/stats-grid/stats-grid.component';
import { ProfileFormComponent, ProfileData } from '../../../shared/components/profile-form/profile-form.component';
import { HamburgerMenuComponent, MenuItem } from '../../../shared/components/hamburger-menu/hamburger-menu.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, StatsGridComponent, ProfileFormComponent, HamburgerMenuComponent, ToastComponent],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent implements OnInit {
  // form fields
  subject: string = '';
  description: string = '';
  fee: number | null = null;
  mode: string = 'online';
  startDate: string | null = null;
  endDate: string | null = null;
  duration: number | null = null;
  scheduleDays: string = '';
  scheduleTime: string = '';
  durationPerClass: number | null = null;
  editingCourseId: string | null = null;
  showEditModal = false;
  isEditingProfile = false;
  isProfileLoading = false;
  managingCourseId: string | null = null;
  enrolledStudents: any[] = [];
  isMenuOpen: boolean = false;
  currentSection: string = 'overview';
  error: string | null = null;

  constructor(
    private teacherService: TeacherService,
    private authService: AuthService,
    private router: Router,
    public toastService: ToastService
  ) {
    if (!this.authService.isAuthenticated() || this.authService.user()?.role !== 'teacher') {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.teacherService.loadProfile();
    this.teacherService.loadCourses();
    this.teacherService.loadEnrollmentRequests();
  }

  createCourse(): void {
    if (!this.subject || !this.fee || !this.mode || !this.scheduleDays || !this.scheduleTime) return;

    const courseData = {
      subject: this.subject,
      description: this.description,
      fee: this.fee,
      mode: this.mode,
      start_date: this.startDate || null,
      end_date: this.endDate || null,
      duration: this.duration || null,
      schedule_days: this.scheduleDays,
      schedule_time: this.scheduleTime,
      duration_per_class: this.durationPerClass || null
    };

    if (this.editingCourseId) {
      this.teacherService.updateCourse(this.editingCourseId, courseData);
      this.toastService.success('Course updated successfully');
      // Redirect back to My Courses after update
      setTimeout(() => {
        this.currentSection = 'my-courses';
      }, 1000);
    } else {
      this.teacherService.createCourse(courseData);
      this.toastService.success('Course created successfully');
      // Redirect back to My Courses after creation
      setTimeout(() => {
        this.currentSection = 'my-courses';
      }, 1000);
    }

    // clear form
    this.clearForm();
  }

  clearForm(): void {
    this.subject = '';
    this.description = '';
    this.fee = null;
    this.mode = 'online';
    this.startDate = null;
    this.endDate = null;
    this.duration = null;
    this.scheduleDays = '';
    this.scheduleTime = '';
    this.durationPerClass = null;
    this.editingCourseId = null;
    this.showEditModal = false;
  }

  editProfile(): void {
    this.currentSection = 'settings';
  }

  updateProfile(profileData: ProfileData): void {
    this.isProfileLoading = true;
    
    this.authService.updateUserProfile(profileData);
    
    // Simulate API call delay
    setTimeout(() => {
      this.isProfileLoading = false;
      this.cancelEditProfile();
      // Navigate back to settings to see updated data
      this.currentSection = 'settings';
    }, 1000);
  }

  cancelEditProfile(): void {
    this.isEditingProfile = false;
  }

  goBack(): void {
    // Try to use browser history back first
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to navigating to home
      this.router.navigate(['/home']);
    }
  }

  async logout(): Promise<void> {
    console.log('Teacher dashboard logout method called');
    
    // Use direct logout like student dashboard for consistency
    this.authService.logout();
    
    // Close menu before navigation
    this.isMenuOpen = false;
    
    // Force navigation after a short delay to ensure auth state is updated
    setTimeout(() => {
      console.log('Navigating to home after logout');
      this.router.navigate(['/home']).catch(err => {
        console.error('Navigation error during logout:', err);
        // Fallback navigation
        window.location.href = '/home';
      });
    }, 100);
  }

  get user() {
    return this.authService.user();
  }

  get profile() {
    return this.teacherService.profile();
  }

  get courses() {
    return this.teacherService.courses();
  }

  get enrollmentRequests() {
    return this.teacherService.enrollmentRequests();
  }

  get courseCount() {
    return this.teacherService.courseCount();
  }

  get pendingRequests() {
    return this.teacherService.pendingRequests();
  }

  approveRequest(requestId: string): void {
    this.teacherService.handleRequest(requestId, 'approve');
  }

  rejectRequest(requestId: string): void {
    this.teacherService.handleRequest(requestId, 'reject');
  }

  editCourse(course: any): void {
    this.editingCourseId = course.id;
    this.subject = course.subject;
    this.description = course.description || '';
    this.fee = course.fee;
    this.mode = course.mode;
    this.startDate = course.start_date || null;
    this.endDate = course.end_date || null;
    this.duration = course.duration || null;
    this.scheduleDays = course.schedule_days || '';
    this.scheduleTime = course.schedule_time || '';
    this.durationPerClass = course.duration_per_class || null;
    this.showEditModal = true;
    this.currentSection = 'create-course';
    
    // Scroll to form
    setTimeout(() => {
      const element = document.querySelector('.create-course-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    this.toastService.info(`Editing course: ${course.subject}`);
  }

  deleteCourse(courseId: string | number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.teacherService.deleteCourse(String(courseId));
      this.toastService.success('Course deleted successfully');
    }
  }

  manageCourse(courseId: string | number): void {
    this.managingCourseId = String(courseId);
    this.loadEnrolledStudents(courseId);
  }

  loadEnrolledStudents(courseId: string | number): void {
    // Simulate loading enrolled students
    this.enrolledStudents = [
      { id: 1, name: 'John Doe', email: 'john@example.com', enrolledAt: '2024-01-15', progress: 75 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', enrolledAt: '2024-01-18', progress: 60 },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', enrolledAt: '2024-01-20', progress: 90 }
    ];
  }

  closeManageCourse(): void {
    this.managingCourseId = null;
    this.enrolledStudents = [];
  }

  removeStudent(studentId: number): void {
    if (confirm('Are you sure you want to remove this student from the course?')) {
      this.enrolledStudents = this.enrolledStudents.filter(student => student.id !== studentId);
      this.toastService.success('Student removed from course');
    }
  }

  cancelEdit(): void {
    this.clearForm();
  }

  get stats(): StatItem[] {
    return [
      { value: this.courseCount, label: 'Courses Created', icon: '📚' },
      { value: this.pendingRequests, label: 'Pending Requests', icon: '⏳' }
    ];
  }

  getCourseById(courseId: string): any {
    return this.courses.find(course => String(course.id) === courseId);
  }

  get menuItems(): MenuItem[] {
    return [
      { id: 'overview', label: 'Dashboard', icon: '📊', active: this.currentSection === 'overview' },
      { id: 'create-course', label: 'Create New Course', icon: '➕', active: this.currentSection === 'create-course' },
      { id: 'my-courses', label: 'My Courses', icon: '📚', active: this.currentSection === 'my-courses', badge: String(this.courseCount) },
      { id: 'enrollment-requests', label: 'Enrollment Requests', icon: '📋', active: this.currentSection === 'enrollment-requests', badge: this.pendingRequests > 0 ? String(this.pendingRequests) : undefined },
      { id: 'edit-profile', label: 'Edit Profile', icon: '👤', active: this.currentSection === 'edit-profile' },
      { id: 'settings', label: 'Settings', icon: '⚙️', active: this.currentSection === 'settings' },
      { id: 'logout', label: 'Logout', icon: '🚪' }
    ];
  }

  async onMenuClick(item: MenuItem): Promise<void> {
    switch (item.id) {
      case 'overview':
        this.currentSection = 'overview';
        break;
      case 'create-course':
        this.currentSection = 'create-course';
        break;
      case 'my-courses':
        this.currentSection = 'my-courses';
        break;
      case 'enrollment-requests':
        this.currentSection = 'enrollment-requests';
        break;
      case 'edit-profile':
        this.editProfile();
        this.currentSection = 'settings';
        break;
      case 'settings':
        this.currentSection = 'settings';
        break;
      case 'logout':
        await this.logout();
        break;
    }
  }

  // Settings functionality
  openAccountSettings(): void {
    this.currentSection = 'account-settings';
  }

  openNotificationSettings(): void {
    this.currentSection = 'notification-settings';
  }

  openPaymentSettings(): void {
    this.currentSection = 'payment-settings';
  }

  openLearningSettings(): void {
    this.currentSection = 'learning-settings';
  }

  openPlatformAnalytics(): void {
    this.currentSection = 'platform-analytics';
  }
}
