import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {
  currentTab = signal<string>('courses');
  searchQuery = signal<string>('');
  isEditingProfile = signal<boolean>(false);
  editingName = '';
  editingEmail = '';
  editingPhone = '';

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.studentService.loadAllCourses();
    this.studentService.loadAllTeachers();
    this.studentService.loadMyEnrollments();
    this.studentService.loadMyRequests();
  }

  setTab(tab: string): void {
    this.currentTab.set(tab);
  }

  search(): void {
    if (this.searchQuery()) {
      this.studentService.searchCourses(this.searchQuery());
    }
  }

  refreshCourses(): void {
    this.studentService.refreshCourses();
  }

  requestEnrollment(courseId: string): void {
    this.studentService.requestEnrollment(courseId);
  }

  cancelRequest(requestId: string): void {
    if (confirm('Are you sure you want to cancel this request?')) {
      this.studentService.cancelRequest(requestId);
    }
  }

  editProfile(): void {
    const user = this.authService.user();
    if (user) {
      this.editingName = user.name;
      this.editingEmail = user.email;
      this.editingPhone = user.phone || '';
      this.isEditingProfile.set(true);
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
    this.isEditingProfile.set(false);
    this.editingName = '';
    this.editingEmail = '';
    this.editingPhone = '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  get user() {
    return this.authService.user();
  }

  get allCourses() {
    return this.studentService.allCourses();
  }

  get myEnrollments() {
    return this.studentService.myEnrollments();
  }

  get myRequests() {
    return this.studentService.myRequests();
  }

  get allTeachers() {
    return this.studentService.allTeachers();
  }

  get searchResults() {
    return this.studentService.searchResults();
  }

  get loading() {
    return this.studentService.loading();
  }

  get error() {
    return this.studentService.error();
  }

  get enrollmentCount() {
    return this.studentService.enrollmentCount();
  }
}
