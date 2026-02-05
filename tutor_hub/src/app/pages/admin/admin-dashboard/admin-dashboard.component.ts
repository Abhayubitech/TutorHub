import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';
import { ThemeService } from '../../../services/theme.service';
import { StatsGridComponent, StatItem } from '../../../shared/components/stats-grid/stats-grid.component';
import { ProfileFormComponent, ProfileData } from '../../../shared/components/profile-form/profile-form.component';
import { HamburgerMenuComponent, MenuItem } from '../../../shared/components/hamburger-menu/hamburger-menu.component';
import { SweetAlertService } from '../../../services/sweetalert.service';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  phone?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, StatsGridComponent, ProfileFormComponent, HamburgerMenuComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AdminDashboardComponent implements OnInit {
  userFilter: 'all' | 'student' | 'teacher' = 'all';
  isEditingProfile = false;
  editingUserId: string | null = null;
  isProfileLoading = false;
  currentNavSection = signal<string>('overview');
  isMenuOpen: boolean = false;
  
  // Accordion state management
  expandedTeacherAccordions: Set<string> = new Set();
  expandedStudentAccordions: Set<string> = new Set();

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    public themeService: ThemeService,
    private toastService: ToastService,
    private sweetAlert: SweetAlertService
  ) {
    if (!this.authService.isAuthenticated() || this.authService.user()?.role !== 'admin') {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    // Theme is automatically applied by ThemeService constructor
    // No need to manually set it here as it might override stored preference
    
    this.adminService.loadAllUsers();
    this.adminService.loadCourses();
    this.adminService.loadRecentUsers(10);
    this.adminService.loadManageOverview();
    this.filterUsers('all');
  }

  filterUsers(filter: 'all' | 'student' | 'teacher'): void {
    this.userFilter = filter;
  }

  get filteredUsers(): User[] {
    const users = this.adminService.users() as User[];
    if (this.userFilter === 'all') {
      return users;
    }
    return users.filter(u => u.role === this.userFilter);
  }

  editUser(userId: string | number): void {
    const user = this.adminService.users().find(u => u.id === userId);
    if (user) {
      this.editingUserId = String(userId);
      this.isEditingProfile = true;
    }
  }

  // Method to edit current user's profile
  editCurrentUser(): void {
    const currentUser = this.authService.user();
    if (currentUser) {
      this.editingUserId = String(currentUser.id);
      this.isEditingProfile = true;
    }
  }

  updateUser(userData: ProfileData): void {
    if (this.editingUserId) {
      this.isProfileLoading = true;
      
      this.adminService.updateUser(this.editingUserId, userData).subscribe({
        next: (response: any) => {
          // Check if the edited user is the current logged-in user
          const currentUser = this.authService.user();
          if (currentUser && String(currentUser.id) === this.editingUserId) {
            // Update the current user data in auth service immediately
            const updatedUser = { ...currentUser, ...userData };
            this.authService.updateCurrentUser(updatedUser);
            this.sweetAlert.showToast('Profile updated successfully', 'success', 'top-end', 3000);
          } else {
            this.sweetAlert.showToast('User profile updated successfully', 'success', 'top-end', 3000);
          }
          
          // Refresh users list to show updated data
          this.adminService.loadAllUsers();
          this.isProfileLoading = false;
          this.cancelEditUser();
        },
        error: (error: any) => {
          this.isProfileLoading = false;
          this.sweetAlert.showToast('Failed to update profile: ' + (error.error?.message || 'Unknown error'), 'error', 'top-end', 3000);
          console.error('Profile update error:', error);
          this.cancelEditUser();
        }
      });
    }
  }

  cancelEditUser(): void {
    this.isEditingProfile = false;
    this.editingUserId = null;
  }

  getEditingUserData(): User | undefined {
    if (this.editingUserId) {
      return this.adminService.users().find(u => u.id === Number(this.editingUserId));
    }
    return undefined;
  }

  async deleteUser(userId: string | number): Promise<void> {
    const confirmed = await this.sweetAlert.confirmDelete('this user account');
    if (confirmed) {
      this.adminService.deleteUser(String(userId));
      this.sweetAlert.showSuccess('Deleted!', 'User has been deleted.');
    }
  }

  viewUserCourses(userId: string | number): void {
    const user = this.adminService.users().find(u => u.id === userId);
    if (user) {
      if (user.role === 'teacher') {
        // Navigate to teacher courses section filtered by this teacher
        this.currentNavSection.set('teacher-courses');
        // You could add a filter parameter to show only this teacher's courses
        this.sweetAlert.showToast(`Viewing courses taught by ${user.name}`, 'info', 'top-end', 3000);
      } else if (user.role === 'student') {
        // Navigate to student enrollments section filtered by this student
        this.currentNavSection.set('student-enrollments');
        // You could add a filter parameter to show only this student's enrollments
        this.sweetAlert.showToast(`Viewing enrollments for ${user.name}`, 'info', 'top-end', 3000);
      }
    }
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
    console.log('Admin dashboard logout method called');
    
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

  get totalUsers() {
    return this.adminService.totalUsers();
  }

  get studentCount() {
    return this.adminService.studentCount();
  }

  get teacherCount() {
    return this.adminService.teacherCount();
  }

  get courseCount() {
    return this.adminService.courseCount();
  }

  get recentUsers() {
    return this.adminService.recentUsers();
  }

  get allUsers() {
    return this.adminService.users();
  }

  get manageTeacherCourses() {
    const courses = this.adminService.manageTeacherCourses();
    console.log('manageTeacherCourses getter called, courses:', courses);
    return courses;
  }

  get manageStudentEnrollments() {
    const enrollments = this.adminService.manageStudentEnrollments();
    console.log('manageStudentEnrollments getter called, enrollments:', enrollments);
    return enrollments;
  }

  get loading() {
    return this.adminService.loading();
  }

  get error() {
    return this.adminService.error();
  }

  get stats(): StatItem[] {
    return [
      { value: this.totalUsers, label: 'Total Users', icon: '👥' },
      { value: this.studentCount, label: 'Students', icon: '🎓' },
      { value: this.teacherCount, label: 'Teachers', icon: '👨‍🏫' },
      { value: this.courseCount, label: 'Total Courses', icon: '📚' }
    ];
  }

  get menuItems(): MenuItem[] {
    return [
      { id: 'overview', label: 'Dashboard', icon: '📊', active: this.currentNavSection() === 'overview' },
      { id: 'users', label: 'Manage Users', icon: '👥', active: this.currentNavSection() === 'users' },
      { id: 'teacher-courses', label: 'Teacher Courses', icon: '👨‍🏫', active: this.currentNavSection() === 'teacher-courses' },
      { id: 'student-enrollments', label: 'Student Enrollments', icon: '🎓', active: this.currentNavSection() === 'student-enrollments' },
      { id: 'settings', label: 'Settings', icon: '⚙️', active: this.currentNavSection() === 'settings' },
      { id: 'logout', label: 'Logout', icon: '🚪' }
    ];
  }

  async onMenuClick(item: MenuItem): Promise<void> {
    switch (item.id) {
      case 'overview':
        this.currentNavSection.set('overview');
        break;
      case 'users':
        this.currentNavSection.set('users');
        break;
      case 'settings':
        this.currentNavSection.set('settings');
        break;
      case 'teacher-courses':
        this.currentNavSection.set('teacher-courses');
        break;
      case 'student-enrollments':
        this.currentNavSection.set('student-enrollments');
        break;
      case 'logout':
        await this.logout();
        break;
    }
  }

  // Settings functionality
  openAccountSettings(): void {
    this.currentNavSection.set('account-settings');
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    const currentTheme = this.themeService.getCurrentTheme();
    this.sweetAlert.showToast(`Switched to ${currentTheme} mode`, 'success', 'top-end', 3000);
  }

  setNavSection(section: string): void {
    this.currentNavSection.set(section);
  }

  // Accordion toggle methods
  toggleTeacherAccordion(teacherId: string): void {
    if (this.expandedTeacherAccordions.has(teacherId)) {
      this.expandedTeacherAccordions.delete(teacherId);
    } else {
      this.expandedTeacherAccordions.add(teacherId);
    }
  }

  toggleStudentAccordion(studentId: string): void {
    if (this.expandedStudentAccordions.has(studentId)) {
      this.expandedStudentAccordions.delete(studentId);
    } else {
      this.expandedStudentAccordions.add(studentId);
    }
  }

  isTeacherAccordionExpanded(teacherId: string): boolean {
    return this.expandedTeacherAccordions.has(teacherId);
  }

  isStudentAccordionExpanded(studentId: string): boolean {
    return this.expandedStudentAccordions.has(studentId);
  }

}
