import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';
import { StatsGridComponent, StatItem } from '../../../shared/components/stats-grid/stats-grid.component';
import { ProfileFormComponent, ProfileData } from '../../../shared/components/profile-form/profile-form.component';
import { HamburgerMenuComponent, MenuItem } from '../../../shared/components/hamburger-menu/hamburger-menu.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

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
  imports: [CommonModule, FormsModule, StatsGridComponent, ProfileFormComponent, HamburgerMenuComponent, ToastComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  userFilter: 'all' | 'student' | 'teacher' = 'all';
  isEditingProfile = false;
  editingUserId: string | null = null;
  isProfileLoading = false;
  currentNavSection = signal<string>('overview');
  isMenuOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    private toastService: ToastService
  ) {
    if (!this.authService.isAuthenticated() || this.authService.user()?.role !== 'admin') {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
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

  updateUser(userData: ProfileData): void {
    if (this.editingUserId) {
      this.isProfileLoading = true;
      
      this.adminService.updateUser(this.editingUserId, userData);
      
      // Check if the edited user is the current logged-in user
      const currentUser = this.authService.user();
      if (currentUser && String(currentUser.id) === this.editingUserId) {
        // Update the current user data in auth service immediately
        const updatedUser = { ...currentUser, ...userData };
        this.authService.updateCurrentUser(updatedUser);
      }
      
      // Simulate API call delay
      setTimeout(() => {
        this.isProfileLoading = false;
        this.cancelEditUser();
        // Refresh users list to show updated data
        this.adminService.loadAllUsers();
      }, 1000);
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

  deleteUser(userId: string | number): void {
    if (confirm('Are you sure you want to delete this user account?')) {
      this.adminService.deleteUser(String(userId));
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
    return this.adminService.manageTeacherCourses();
  }

  get manageStudentEnrollments() {
    return this.adminService.manageStudentEnrollments();
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

  setNavSection(section: string): void {
    this.currentNavSection.set(section);
  }

}
