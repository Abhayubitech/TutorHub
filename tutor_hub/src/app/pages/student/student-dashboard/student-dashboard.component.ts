import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { ProfileFormComponent, ProfileData } from '../../../shared/components/profile-form/profile-form.component';
import { HamburgerMenuComponent, MenuItem } from '../../../shared/components/hamburger-menu/hamburger-menu.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileFormComponent, HamburgerMenuComponent, ToastComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {
  currentTab = signal<string>('overview');
  searchQuery = signal<string>('');
  isEditingProfile = signal<boolean>(false);
  isProfileLoading = signal<boolean>(false);
  isMenuOpen: boolean = false;
  expandedTeachers = new Set<string>();

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router,
    public toastService: ToastService
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
    if (this.searchQuery().trim().length < 2) {
      // If search query is too short, show all courses
      return;
    }
    this.studentService.searchCourses(this.searchQuery());
  }

  onSearchInput(): void {
    // Auto-search when user types (with debouncing could be added)
    if (this.searchQuery().trim().length >= 2) {
      this.search();
    }
  }

  clearSearch(): void {
    this.searchQuery.set('');
    // Clear search results to show all courses again
    this.studentService.clearSearchResults();
  }

  refreshCourses(): void {
    this.studentService.refreshCourses();
  }

  toggleTeacherCourses(teacherId: string): void {
    if (this.expandedTeachers.has(teacherId)) {
      this.expandedTeachers.delete(teacherId);
    } else {
      this.expandedTeachers.add(teacherId);
    }
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
    this.currentTab.set('settings');
  }

  updateProfile(profileData: ProfileData): void {
    this.isProfileLoading.set(true);
    
    this.authService.updateUserProfile(profileData);
    
    // Wait for the auth service to complete the update
    setTimeout(() => {
      this.isProfileLoading.set(false);
      this.cancelEditProfile();
      // Navigate back to profile tab to see updated data
      this.currentTab.set('profile');
    }, 1000);
  }

  cancelEditProfile(): void {
    this.isEditingProfile.set(false);
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
    console.log('Student dashboard logout method called');
    
    // Temporarily bypass confirmation for testing
    console.log('Bypassing confirmation for testing...');
    this.authService.logout();
    
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

  get menuItems(): MenuItem[] {
    return [
      { id: 'overview', label: 'Dashboard', icon: '📊', active: this.currentTab() === 'overview' },
      { id: 'profile', label: 'My Profile', icon: '👤', active: this.currentTab() === 'profile' },
      { id: 'courses', label: 'Browse Courses', icon: '📚', active: this.currentTab() === 'courses' },
      { id: 'teachers', label: 'Teachers', icon: '👨‍🏫', active: this.currentTab() === 'teachers' },
      { id: 'enrollments', label: 'My Enrollments', icon: '📝', active: this.currentTab() === 'enrollments', badge: this.enrollmentCount > 0 ? String(this.enrollmentCount) : undefined },
      { id: 'requests', label: 'My Requests', icon: '⏳', active: this.currentTab() === 'requests' },
      { id: 'settings', label: 'Settings', icon: '⚙️', active: this.currentTab() === 'settings' },
      { id: 'logout', label: 'Logout', icon: '🚪' }
    ];
  }

  async onMenuClick(item: MenuItem): Promise<void> {
    console.log('Student dashboard menu click received:', item.id, item.label);
    
    switch (item.id) {
      case 'overview':
        this.currentTab.set('overview');
        break;
      case 'profile':
        this.currentTab.set('profile');
        break;
      case 'courses':
        this.currentTab.set('courses');
        break;
      case 'teachers':
        this.currentTab.set('teachers');
        break;
      case 'enrollments':
        this.currentTab.set('enrollments');
        break;
      case 'requests':
        this.currentTab.set('requests');
        break;
      case 'settings':
        this.currentTab.set('settings');
        break;
      case 'logout':
        console.log('Logout case triggered in student dashboard');
        await this.logout();
        break;
    }
  }

  // Settings functionality
  openAccountSettings(): void {
    this.currentTab.set('account-settings');
  }

}
