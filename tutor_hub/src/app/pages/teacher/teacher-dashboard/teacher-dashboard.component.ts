import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TeacherService } from '../../../services/teacher.service';
import { StudentService } from '../../../services/student.service';
import { ToastService } from '../../../services/toast.service';
import { ThemeService } from '../../../services/theme.service';
import { SweetAlertService } from '../../../services/sweetalert.service';
import { StatsGridComponent, StatItem } from '../../../shared/components/stats-grid/stats-grid.component';
import { ProfileFormComponent, ProfileData } from '../../../shared/components/profile-form/profile-form.component';
import { HamburgerMenuComponent, MenuItem } from '../../../shared/components/hamburger-menu/hamburger-menu.component';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, StatsGridComponent, ProfileFormComponent, HamburgerMenuComponent],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css',
  encapsulation: ViewEncapsulation.None
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
  
  // Search functionality
  searchQuery: string = '';
  
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
    private teacherService: TeacherService,
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService,
    public toastService: ToastService,
    public sweetAlert: SweetAlertService
  ) {
    if (!this.authService.isAuthenticated() || this.authService.user()?.role !== 'teacher') {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    // Theme is automatically applied by ThemeService constructor
    // No need to manually set it here as it might override stored preference
    
    this.teacherService.loadProfile();
    this.teacherService.loadCourses();
    this.teacherService.loadEnrollmentRequests();
  }

  // Add getter for filteredCourses to ensure it's always updated
  get filteredCourses(): any[] {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      return this.courses;
    }
    return this.courses.filter((course: any) => 
      course.subject.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      course.mode.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      course.scheduleDays?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      course.scheduleTime?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  searchCourses(): void {
    // The getter will handle filtering automatically
    // This method can be simplified or used for additional logic if needed
  }

  updateFilteredCourses(): void {
    this.searchCourses();
  }

  createCourse(): void {
    // Enhanced validation with user feedback
    if (!this.subject) {
      this.sweetAlert.showToast('Please enter course subject', 'error', 'top-end', 3000);
      return;
    }
    if (!this.fee || this.fee <= 0) {
      this.sweetAlert.showToast('Please enter a valid course fee', 'error', 'top-end', 3000);
      return;
    }
    if (!this.mode) {
      this.sweetAlert.showToast('Please select teaching mode', 'error', 'top-end', 3000);
      return;
    }
    if (!this.scheduleDays) {
      this.sweetAlert.showToast('Please select schedule days', 'error', 'top-end', 3000);
      return;
    }
    if (!this.scheduleTime) {
      this.sweetAlert.showToast('Please select schedule time', 'error', 'top-end', 3000);
      return;
    }

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
      this.teacherService.updateCourse(this.editingCourseId, courseData).subscribe({
        next: (response: any) => {
          if (response.success) {
            // Update WhatsApp groups after course update
            const courseId = this.editingCourseId;
            
            // Update demo WhatsApp group if data provided
            if (this.demoGroupName && this.demoGroupLink) {
              this.updateWhatsAppGroup(courseId!, 'demo');
            }
            
            // Update approved WhatsApp group if data provided
            if (this.approvedGroupName && this.approvedGroupLink) {
              this.updateWhatsAppGroup(courseId!, 'approved');
            }
            
            // Reload courses to get updated list
            this.teacherService.loadCourses();
            
            this.sweetAlert.showToast('Course updated successfully', 'success', 'top-end', 3000);
            // Redirect back to My Courses after update
            setTimeout(() => {
              this.currentSection = 'my-courses';
            }, 1000);
          }
        },
        error: (error: any) => {
          console.error('Course update error:', error);
          this.sweetAlert.showToast('Error updating course: ' + (error.error?.message || 'Unknown error'), 'error', 'top-end', 3000);
        }
      });
    } else {
      this.teacherService.createCourse(courseData).subscribe({
        next: (response: any) => {
          if (response.success && response.course) {
            // Create WhatsApp groups after course creation
            const courseId = response.course.id;
            
            // Create demo WhatsApp group if data provided
            if (this.demoGroupName && this.demoGroupLink) {
              this.createWhatsAppGroup(courseId, 'demo');
            }
            
            // Create approved WhatsApp group if data provided
            if (this.approvedGroupName && this.approvedGroupLink) {
              this.createWhatsAppGroup(courseId, 'approved');
            }
            
            // Reload courses to get updated list
            this.teacherService.loadCourses();
            
            this.sweetAlert.showToast('Course created successfully', 'success', 'top-end', 3000);
            // Redirect back to My Courses after creation
            setTimeout(() => {
              this.currentSection = 'my-courses';
            }, 1000);
          }
        },
        error: (error: any) => {
          console.error('Course creation error:', error);
          this.sweetAlert.showToast('Error creating course: ' + (error.error?.message || 'Unknown error'), 'error', 'top-end', 3000);
        }
      });
    }

    // clear form
    this.clearForm();
  }

  // WhatsApp group management
  createWhatsAppGroup(courseId: string, groupType: 'demo' | 'approved'): void {
    const groupName = groupType === 'demo' ? this.demoGroupName : this.approvedGroupName;
    const inviteLink = groupType === 'demo' ? this.demoGroupLink : this.approvedGroupLink;
    const description = groupType === 'demo' ? this.demoGroupDescription : this.approvedGroupDescription;

    if (!groupName || !inviteLink) {
      this.sweetAlert.showToast('Group name and invite link are required', 'error', 'top-end', 3000);
      return;
    }

    const groupData = {
      courseId,
      groupName,
      inviteLink,
      groupType,
      description,
      teacherPhone: this.teacherPhone
    };

    this.teacherService.createWhatsAppGroup(groupData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.sweetAlert.showToast(`${groupType} WhatsApp group created successfully`, 'success', 'top-end', 3000);
          this.clearWhatsAppForm(groupType);
        } else {
          this.sweetAlert.showToast('Failed to create WhatsApp group: ' + (response.message || 'Unknown error'), 'error', 'top-end', 3000);
        }
      },
      error: (error: any) => {
        console.error('WhatsApp group creation error:', error);
        this.sweetAlert.showToast('Error creating WhatsApp group: ' + (error.error?.message || 'Unknown error'), 'error', 'top-end', 3000);
      }
    });
  }

  updateWhatsAppGroup(courseId: string, groupType: 'demo' | 'approved'): void {
    const groupName = groupType === 'demo' ? this.demoGroupName : this.approvedGroupName;
    const inviteLink = groupType === 'demo' ? this.demoGroupLink : this.approvedGroupLink;
    const description = groupType === 'demo' ? this.demoGroupDescription : this.approvedGroupDescription;

    if (!groupName || !inviteLink) {
      this.sweetAlert.showToast('Group name and invite link are required', 'error', 'top-end', 3000);
      return;
    }

    const groupData = {
      groupName,
      inviteLink,
      description,
      teacherPhone: this.teacherPhone
    };

    this.teacherService.updateWhatsAppGroup(courseId, groupType, groupData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.sweetAlert.showToast(`${groupType} WhatsApp group updated successfully`, 'success', 'top-end', 3000);
        } else {
          this.sweetAlert.showToast('Failed to update WhatsApp group: ' + (response.message || 'Unknown error'), 'error', 'top-end', 3000);
        }
      },
      error: (error: any) => {
        console.error('WhatsApp group update error:', error);
        this.sweetAlert.showToast('Error updating WhatsApp group: ' + (error.error?.message || 'Unknown error'), 'error', 'top-end', 3000);
      }
    });
  }

  clearWhatsAppForm(groupType: 'demo' | 'approved'): void {
    if (groupType === 'demo') {
      this.demoGroupName = '';
      this.demoGroupLink = '';
      this.demoGroupDescription = '';
    } else {
      this.approvedGroupName = '';
      this.approvedGroupLink = '';
      this.approvedGroupDescription = '';
    }
  }

  // Payment verification methods
  loadPaymentVerifications(courseId: string): void {
    this.teacherService.getPaymentVerifications(courseId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.paymentVerifications = response.verifications;
        }
      },
      error: (error: any) => {
        console.error('Error loading payment verifications:', error);
      }
    });
  }

  approvePayment(verificationId: string): void {
    this.teacherService.updatePaymentVerification(verificationId, 'approved', 'Payment verified and approved').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.sweetAlert.showToast('Payment approved successfully', 'success', 'top-end', 3000);
          this.loadPaymentVerifications(this.selectedVerification?.course_id);
        }
      },
      error: (error: any) => {
        this.sweetAlert.showToast('Error approving payment: ' + (error.error?.message || 'Unknown error'), 'error', 'top-end', 3000);
      }
    });
  }

  rejectPayment(verificationId: string): void {
    this.teacherService.updatePaymentVerification(verificationId, 'rejected', 'Payment rejected').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.sweetAlert.showToast('Payment rejected successfully', 'success', 'top-end', 3000);
          this.loadPaymentVerifications(this.selectedVerification?.course_id);
        }
      },
      error: (error: any) => {
        this.sweetAlert.showToast('Error rejecting payment: ' + (error.error?.message || 'Unknown error'), 'error', 'top-end', 3000);
      }
    });
  }

  viewPaymentScreenshot(screenshotPath: string): void {
    if (screenshotPath) {
      // Construct the full URL to the uploaded screenshot
      const imageUrl = `http://localhost:3000/${screenshotPath}`;
      window.open(imageUrl, '_blank');
    } else {
      this.sweetAlert.showToast('No screenshot available', 'warning', 'top-end', 3000);
    }
  }

  // Student payment methods
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

    this.studentService.uploadPaymentScreenshot(this.selectedVerification.course_id, this.selectedFile, paymentData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.sweetAlert.showToast('Payment screenshot uploaded successfully', 'success', 'top-end', 3000);
          this.closePaymentUploadModal();
        } else {
          this.sweetAlert.showToast('Failed to upload payment screenshot', 'error', 'top-end', 3000);
        }
      },
      error: (error: any) => {
        this.sweetAlert.showToast('Error uploading payment screenshot: ' + (error.error?.message || 'Unknown error'), 'error', 'top-end', 3000);
      }
    });
  }

  // WhatsApp group access for students
  getDemoWhatsAppLink(courseId: string): void {
    this.studentService.getWhatsAppGroup(courseId, 'demo').subscribe({
      next: (response: any) => {
        if (response.success && response.group) {
          this.demoWhatsAppLink = response.group.invite_link;
          this.sweetAlert.showToast('Demo WhatsApp group link retrieved', 'success', 'top-end', 3000);
        } else {
          this.sweetAlert.showToast('Demo group not available', 'warning', 'top-end', 3000);
        }
      },
      error: (error: any) => {
        this.sweetAlert.showToast('Error getting demo group: ' + (error.error?.message || 'Unknown error'), 'error', 'top-end', 3000);
      }
    });
  }

  getApprovedWhatsAppLink(courseId: string): void {
    this.studentService.getWhatsAppGroup(courseId, 'approved').subscribe({
      next: (response: any) => {
        if (response.success && response.group) {
          this.approvedWhatsAppLink = response.group.invite_link;
          this.sweetAlert.showToast('Approved WhatsApp group link retrieved', 'success', 'top-end', 3000);
        } else {
          this.sweetAlert.showToast('You need to complete payment verification first', 'warning', 'top-end', 3000);
        }
      },
      error: (error: any) => {
        this.sweetAlert.showToast('Error getting approved group: ' + (error.error?.message || 'Unknown error'), 'error', 'top-end', 3000);
      }
    });
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
    
    // Clear WhatsApp forms
    this.clearWhatsAppForm('demo');
    this.clearWhatsAppForm('approved');
    this.teacherPhone = '';
  }

  editProfile(): void {
    this.currentSection = 'settings';
  }

  updateProfile(profileData: ProfileData): void {
    this.isProfileLoading = true;
    
    this.authService.updateUserProfile(profileData).subscribe({
      next: (response: any) => {
        if (response.success && response.user) {
          // Update the user data in auth service
          this.authService.updateCurrentUser(response.user);
          this.sweetAlert.showToast('Profile updated successfully', 'success', 'top-end', 3000);
          
          // Force change detection by navigating to settings after a short delay
          setTimeout(() => {
            this.currentSection = 'settings';
            this.isProfileLoading = false;
            this.cancelEditProfile();
          }, 500);
        } else {
          this.sweetAlert.showToast('Failed to update profile', 'error', 'top-end', 3000);
          this.isProfileLoading = false;
          this.cancelEditProfile();
        }
      },
      error: (error: any) => {
        this.isProfileLoading = false;
        this.sweetAlert.showToast('Failed to update profile: ' + (error.error?.message || 'Unknown error'), 'error', 'top-end', 3000);
        console.error('Profile update error:', error);
        this.cancelEditProfile();
      }
    });
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
    
    const confirmed = await this.sweetAlert.confirmLogout();
    if (confirmed) {
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
    
    // Convert ISO dates to yyyy-MM-dd format for date inputs
    this.startDate = course.start_date ? this.formatDateForInput(course.start_date) : null;
    this.endDate = course.end_date ? this.formatDateForInput(course.end_date) : null;
    
    this.duration = course.duration || null;
    this.scheduleDays = course.schedule_days || '';
    this.scheduleTime = course.schedule_time || '';
    this.durationPerClass = course.duration_per_class || null;
    
    // Load WhatsApp groups for this course
    this.loadWhatsAppGroupsForEdit(course.id);
    
    this.showEditModal = true;
    this.currentSection = 'create-course';
    
    // Scroll to form
    setTimeout(() => {
      const element = document.querySelector('.create-course-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    this.sweetAlert.showToast(`Editing course: ${course.subject}`, 'info', 'top-end', 3000);
  }

  loadWhatsAppGroupsForEdit(courseId: string): void {
    // Load WhatsApp groups for this course
    this.teacherService.getWhatsAppGroups(courseId).subscribe({
      next: (response: any) => {
        if (response.success && response.groups) {
          // Clear existing WhatsApp form data
          this.demoGroupName = '';
          this.demoGroupLink = '';
          this.demoGroupDescription = '';
          this.approvedGroupName = '';
          this.approvedGroupLink = '';
          this.approvedGroupDescription = '';
          this.teacherPhone = '';
          
          // Populate WhatsApp group data
          response.groups.forEach((group: any) => {
            if (group.group_type === 'demo') {
              this.demoGroupName = group.group_name || '';
              this.demoGroupLink = group.invite_link || '';
              this.demoGroupDescription = group.description || '';
              this.teacherPhone = group.teacher_phone || '';
            } else if (group.group_type === 'approved') {
              this.approvedGroupName = group.group_name || '';
              this.approvedGroupLink = group.invite_link || '';
              this.approvedGroupDescription = group.description || '';
              this.teacherPhone = group.teacher_phone || '';
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error loading WhatsApp groups for edit:', error);
        // Don't show error toast to user, just log it
      }
    });

    // Also load full course details with schedule information
    this.teacherService.getCourseById(courseId).subscribe({
      next: (response: any) => {
        if (response.success && response.course) {
          const course = response.course;
          // Update schedule fields with the data from backend
          this.scheduleDays = course.schedule_days || '';
          this.scheduleTime = course.schedule_time || '';
          this.durationPerClass = course.duration_per_class || null;
        }
      },
      error: (error: any) => {
        console.error('Error loading course details for edit:', error);
        // Don't show error toast to user, just log it
      }
    });
  }

  // Helper method to format date for input field
  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    
    // Handle different date formats
    let date: Date;
    try {
      // If it's already in yyyy-MM-dd format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      // Parse ISO string or other formats
      date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date format:', dateString);
        return '';
      }
      
      // Format as yyyy-MM-dd
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  async deleteCourse(courseId: string | number): Promise<void> {
    const confirmed = await this.sweetAlert.confirmDelete('this course');
    if (confirmed) {
      this.teacherService.deleteCourse(String(courseId));
      this.sweetAlert.showToast('Course deleted successfully', 'success', 'top-end', 3000);
      this.sweetAlert.showSuccess('Deleted!', 'Course has been deleted successfully.');
    }
  }

  manageCourse(courseId: string | number): void {
    this.managingCourseId = String(courseId);
    this.loadEnrolledStudents(courseId);
    this.loadPaymentVerifications(String(courseId));
  }

  loadEnrolledStudents(courseId: string | number): void {
    this.teacherService.loadEnrolledStudents(String(courseId)).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.enrolledStudents = response.students || [];
        } else {
          this.enrolledStudents = [];
          this.sweetAlert.showToast('Failed to load enrolled students', 'error', 'top-end', 3000);
        }
      },
      error: (error: any) => {
        console.error('Error loading enrolled students:', error);
        this.enrolledStudents = [];
        this.sweetAlert.showToast('Error loading students: ' + (error.error?.message || 'Unknown error'), 'error', 'top-end', 3000);
      }
    });
  }

  closeManageCourse(): void {
    this.managingCourseId = null;
    this.enrolledStudents = [];
  }

  async removeStudent(studentId: number): Promise<void> {
    const confirmed = await this.sweetAlert.confirmRemove('this student from the course');
    if (confirmed) {
      this.enrolledStudents = this.enrolledStudents.filter(student => student.id !== studentId);
      this.sweetAlert.showToast('Student removed from course', 'success', 'top-end', 3000);
      this.sweetAlert.showSuccess('Removed!', 'Student has been removed from the course.');
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

  toggleTheme(): void {
    this.themeService.toggleTheme();
    const currentTheme = this.themeService.getCurrentTheme();
    this.sweetAlert.showToast(`Switched to ${currentTheme} mode`, 'success', 'top-end', 3000);
  }
}
