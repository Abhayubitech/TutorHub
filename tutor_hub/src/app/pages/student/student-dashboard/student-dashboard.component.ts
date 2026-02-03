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
    
    // Simulate API call delay
    setTimeout(() => {
      this.isProfileLoading.set(false);
      this.cancelEditProfile();
    }, 1000);
  }

  cancelEditProfile(): void {
    this.isEditingProfile.set(false);
  }

  logout(): void {
    this.authService.logoutWithConfirmation();
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

  get menuItems(): MenuItem[] {
    return [
      { id: 'overview', label: 'Dashboard', icon: '📊', active: this.currentTab() === 'overview' },
      { id: 'profile', label: 'My Profile', icon: '👤', active: this.currentTab() === 'profile' },
      { id: 'courses', label: 'Browse Courses', icon: '📚', active: this.currentTab() === 'courses' },
      { id: 'teachers', label: 'Teachers', icon: '👨‍🏫', active: this.currentTab() === 'teachers' },
      { id: 'enrollments', label: 'My Enrollments', icon: '📝', active: this.currentTab() === 'enrollments', badge: this.enrollmentCount > 0 ? String(this.enrollmentCount) : undefined },
      { id: 'requests', label: 'My Requests', icon: '⏳', active: this.currentTab() === 'requests' },
      { id: 'notifications', label: 'Notifications', icon: '🔔', active: this.currentTab() === 'notifications', badge: '3' },
      { id: 'help', label: 'Help & Support', icon: '💬', active: this.currentTab() === 'help' },
      { id: 'settings', label: 'Settings', icon: '⚙️', active: this.currentTab() === 'settings' },
      { id: 'logout', label: 'Logout', icon: '🚪' }
    ];
  }

  onMenuClick(item: MenuItem): void {
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
      case 'notifications':
        this.currentTab.set('notifications');
        break;
      case 'help':
        this.currentTab.set('help');
        break;
      case 'settings':
        this.currentTab.set('settings');
        break;
      case 'logout':
        this.logout();
        break;
    }
  }

  // Settings functionality
  openAccountSettings(): void {
    this.currentTab.set('account-settings');
  }

  openLearningSettings(): void {
    this.currentTab.set('learning-settings');
  }

  openPaymentSettings(): void {
    this.currentTab.set('payment-settings');
  }

  openUserSettings(): void {
    this.currentTab.set('user-settings');
  }

  openPlatformAnalytics(): void {
    this.currentTab.set('platform-analytics');
  }
}
