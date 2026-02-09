import { Component, signal, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { ThemeService } from '../../../services/theme.service';
import { ProfileFormComponent, ProfileData } from '../../../shared/components/profile-form/profile-form.component';
import { HamburgerMenuComponent, MenuItem } from '../../../shared/components/hamburger-menu/hamburger-menu.component';
import { SweetAlertService } from '../../../services/sweetalert.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileFormComponent, HamburgerMenuComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css',
  encapsulation: ViewEncapsulation.None
})
export class StudentDashboardComponent implements OnInit, AfterViewInit {
  currentTab = signal<string>('overview');
  searchQuery = signal<string>('');
  teacherSearchQuery = signal<string>('');
  isEditingProfile = signal<boolean>(false);
  isProfileLoading = signal<boolean>(false);
  isMenuOpen: boolean = false;
  expandedTeachers = new Set<string>();

  // WhatsApp group fields
  demoGroupName: string = '';
  demoGroupLink: string = '';
  demoGroupDescription: string = '';
  approvedGroupName: string = '';
  approvedGroupLink: string = '';
  approvedGroupDescription: string = '';
  teacherPhone: string = '';

  // Payment verification fields
  paymentVerifications: any[] = [];
  selectedVerification: any = null;
  showPaymentModal = false;

  // Student payment fields
  paymentAmount: number | null = null;
  paymentDate: string = '';
  upiTransactionId: string = '';
  selectedFile: File | null = null;
  showPaymentUploadModal = false;
  demoWhatsAppLink: string = '';
  approvedWhatsAppLink: string = '';

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService,
    public toastService: ToastService,
    public sweetAlert: SweetAlertService
  ) {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    // Theme is automatically applied by ThemeService constructor
    // No need to manually set it here as it might override stored preference
    
    this.studentService.loadAllCourses();
    this.studentService.loadAllTeachers();
    this.studentService.loadMyEnrollments();
    this.studentService.loadMyRequests();
  }

  ngAfterViewInit(): void {
    // Theme is automatically applied by ThemeService constructor
    // No need to manually set it here as it might override stored preference
  }

  setTab(tab: string): void {
    this.currentTab.set(tab);
  }

  search(): void {
    if (!this.searchQuery().trim()) {
      // If search query is empty, show all courses
      return;
    }
    this.studentService.searchCourses(this.searchQuery());
  }

  onSearchInput(): void {
    // Auto-search when user types
    if (this.searchQuery().trim()) {
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

  // Teacher search methods
  searchTeachers(): void {
    if (!this.teacherSearchQuery().trim()) {
      return;
    }
    this.studentService.searchTeachers(this.teacherSearchQuery());
  }

  onTeacherSearchInput(): void {
    if (this.teacherSearchQuery().trim()) {
      this.searchTeachers();
    }
  }

  clearTeacherSearch(): void {
    this.teacherSearchQuery.set('');
    this.studentService.clearTeacherSearchResults();
  }

  refreshTeachers(): void {
    this.studentService.refreshTeachers();
  }

  toggleTeacherCourses(teacherId: string): void {
    if (this.expandedTeachers.has(teacherId)) {
      this.expandedTeachers.delete(teacherId);
    } else {
      this.expandedTeachers.add(teacherId);
    }
  }

  requestEnrollment(courseId: string): void {
    // First get the demo WhatsApp group link
    this.getDemoWhatsAppLink(courseId);
    
    // Also create the enrollment request
    this.studentService.requestEnrollment(courseId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.sweetAlert.showSuccess('Request Sent!', 'Your enrollment request has been sent successfully.');
          // Refresh the requests list after successful enrollment
          this.studentService.loadMyRequests();
        } else {
          this.sweetAlert.showError('Error', response.message || 'Failed to send enrollment request');
        }
      },
      error: (error: any) => {
        console.error('Enrollment request error:', error);
        let errorMessage = 'Failed to send enrollment request';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.sweetAlert.showError('Error', errorMessage);
      }
    });
  }

  async cancelRequest(requestId: string): Promise<void> {
    const confirmed = await this.sweetAlert.confirmCancel('this enrollment request');
    if (confirmed) {
      this.studentService.cancelRequest(requestId);
      this.sweetAlert.showSuccess('Cancelled!', 'Your request has been cancelled.');
    }
  }

  editProfile(): void {
    this.currentTab.set('settings');
  }

  updateProfile(profileData: ProfileData): void {
    this.isProfileLoading.set(true);
    
    this.authService.updateUserProfile(profileData).subscribe({
      next: (response: any) => {
        if (response.success && response.user) {
          // Update the user data in auth service
          this.authService.updateCurrentUser(response.user);
          this.sweetAlert.showToast('Profile updated successfully', 'success', 'top-end', 3000);
          
          // Force change detection by navigating to profile after a short delay
          setTimeout(() => {
            this.currentTab.set('profile');
            this.isProfileLoading.set(false);
            this.cancelEditProfile();
          }, 500);
        } else {
          this.sweetAlert.showToast('Failed to update profile', 'error', 'top-end', 3000);
          this.isProfileLoading.set(false);
          this.cancelEditProfile();
        }
      },
      error: (error: any) => {
        this.isProfileLoading.set(false);
        this.sweetAlert.showToast('Failed to update profile: ' + (error.error?.message || 'Unknown error'), 'error', 'top-end', 3000);
        console.error('Profile update error:', error);
        this.cancelEditProfile();
      }
    });
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
    
    const confirmed = await this.sweetAlert.confirmLogout();
    if (confirmed) {
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

  get teacherSearchResults() {
    return this.studentService.teacherSearchResults();
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
    // Navigate to the dedicated settings page
    this.router.navigate(['/settings']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    const currentTheme = this.themeService.getCurrentTheme();
    this.sweetAlert.showToast(`Switched to ${currentTheme} mode`, 'success', 'top-end', 3000);
  }

  // WhatsApp group access methods
  getDemoWhatsAppLink(courseId: string): void {
    console.log('Getting demo WhatsApp group for course:', courseId);
    
    this.studentService.getWhatsAppGroup(courseId, 'demo').subscribe({
      next: (response: any) => {
        console.log('Demo WhatsApp group response:', response);
        if (response.success && response.group) {
          this.demoWhatsAppLink = response.group.invite_link;
          // Show the WhatsApp link in a modal or alert
          this.sweetAlert.showWhatsAppLink('Demo WhatsApp Group', 'Join this group for demo class and payment information:', this.demoWhatsAppLink);
        } else {
          this.sweetAlert.showToast('Demo group not available - Teacher may not have created it yet', 'warning', 'top-end', 3000);
        }
      },
      error: (error: any) => {
        console.error('Error getting demo group:', error);
        let errorMessage = 'Unknown error';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.status) {
          errorMessage = `Server error: ${error.status}`;
        }
        this.sweetAlert.showToast('Error getting demo group: ' + errorMessage, 'error', 'top-end', 3000);
      }
    });
  }

  getApprovedWhatsAppLink(courseId: string): void {
    console.log('Getting approved WhatsApp group for course:', courseId);
    
    this.studentService.getWhatsAppGroup(courseId, 'approved').subscribe({
      next: (response: any) => {
        console.log('Approved WhatsApp group response:', response);
        if (response.success && response.group) {
          this.approvedWhatsAppLink = response.group.invite_link;
          // Show approved WhatsApp link in a modal
          this.sweetAlert.showWhatsAppLink('Class WhatsApp Group', 'Join this group for live classes and course materials:', this.approvedWhatsAppLink);
        } else {
          this.sweetAlert.showToast('You need to complete payment verification first, or teacher may not have created the approved group yet', 'warning', 'top-end', 3000);
        }
      },
      error: (error: any) => {
        console.error('Error getting approved group:', error);
        let errorMessage = 'Unknown error';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.status) {
          errorMessage = `Server error: ${error.status}`;
        }
        this.sweetAlert.showToast('Error getting approved group: ' + errorMessage, 'error', 'top-end', 3000);
      }
    });
  }

  // Payment upload methods
  openPaymentUploadModal(courseId: string): void {
    this.selectedVerification = { course_id: courseId };
    this.showPaymentUploadModal = true;
    this.paymentAmount = null;
    this.paymentDate = '';
    this.upiTransactionId = '';
    this.selectedFile = null;
  }

  closePaymentUploadModal(): void {
    this.showPaymentUploadModal = false;
    this.selectedVerification = null;
    this.paymentAmount = null;
    this.paymentDate = '';
    this.upiTransactionId = '';
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
      } else {
        this.sweetAlert.showToast('Please select an image file', 'error', 'top-end', 3000);
      }
    }
  }

  uploadPaymentScreenshot(): void {
    if (!this.selectedFile || !this.selectedVerification?.course_id) {
      this.sweetAlert.showToast('Please select a file and course', 'error', 'top-end', 3000);
      return;
    }

    const paymentData = {
      paymentAmount: this.paymentAmount,
      paymentDate: this.paymentDate,
      upiTransactionId: this.upiTransactionId
    };

    console.log('Uploading payment screenshot:', {
      courseId: this.selectedVerification.course_id,
      file: this.selectedFile.name,
      paymentData
    });

    this.studentService.uploadPaymentScreenshot(this.selectedVerification.course_id, this.selectedFile, paymentData).subscribe({
      next: (response: any) => {
        console.log('Payment upload response:', response);
        if (response.success) {
          this.sweetAlert.showToast('Payment screenshot uploaded successfully', 'success', 'top-end', 3000);
          this.closePaymentUploadModal();
          // Refresh requests to show updated status
          this.studentService.loadMyRequests();
        } else {
          this.sweetAlert.showToast('Failed to upload payment screenshot: ' + (response.message || 'Unknown error'), 'error', 'top-end', 3000);
        }
      },
      error: (error: any) => {
        console.error('Payment upload error:', error);
        let errorMessage = 'Unknown error';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.status) {
          errorMessage = `Server error: ${error.status}`;
        }
        this.sweetAlert.showToast('Error uploading payment screenshot: ' + errorMessage, 'error', 'top-end', 3000);
      }
    });
  }

}
