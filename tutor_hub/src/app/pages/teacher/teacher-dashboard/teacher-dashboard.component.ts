import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TeacherService } from '../../../services/teacher.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  editingCourseId: string | null = null;
  showEditModal = false;
  isEditingProfile = false;
  editingName = '';
  editingEmail = '';
  editingPhone = '';

  constructor(
    private teacherService: TeacherService,
    private authService: AuthService,
    private router: Router
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
    if (!this.subject || !this.fee || !this.mode) return;

    const courseData = {
      subject: this.subject,
      description: this.description,
      fee: this.fee,
      mode: this.mode,
      start_date: this.startDate || null,
      end_date: this.endDate || null
    };

    if (this.editingCourseId) {
      this.teacherService.updateCourse(this.editingCourseId, courseData);
    } else {
      this.teacherService.createCourse(courseData);
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
    this.editingCourseId = null;
    this.showEditModal = false;
  }

  editProfile(): void {
    const user = this.authService.user();
    if (user) {
      this.editingName = user.name;
      this.editingEmail = user.email;
      this.editingPhone = user.phone || '';
      this.isEditingProfile = true;
    }
  }

  updateProfile(): void {
    // Validate name
    const nameRegex = /^[a-zA-Z\s'-]*$/;
    if (!nameRegex.test(this.editingName)) {
      alert('Name can only contain letters, spaces, hyphens, and apostrophes');
      return;
    }

    if (this.editingName.length > 33) {
      alert('Name must be maximum 33 characters');
      return;
    }

    const profileData = {
      name: this.editingName,
      phone: this.editingPhone || null
    };

    this.authService.updateUserProfile(profileData);
    this.cancelEditProfile();
  }

  cancelEditProfile(): void {
    this.isEditingProfile = false;
    this.editingName = '';
    this.editingEmail = '';
    this.editingPhone = '';
  }

  isEditingProfile(): boolean {
    return this.isEditingProfile;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
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
    this.showEditModal = true;
    
    // Scroll to form
    setTimeout(() => {
      const element = document.querySelector('.create-course-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  deleteCourse(courseId: string | number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.teacherService.deleteCourse(String(courseId));
    }
  }

  manageCourse(courseId: string | number): void {
    console.log('Manage course:', courseId);
    // Open course management page
    // this.router.navigate(['/teacher/manage-course', courseId]);
  }

  cancelEdit(): void {
    this.clearForm();
  }
}
