import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  userFilter: 'all' | 'student' | 'teacher' = 'all';
  isEditingProfile = false;
  editingUserId: string | null = null;
  editingName = '';
  editingEmail = '';
  editingPhone = '';

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
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
      this.editingName = user.name;
      this.editingEmail = user.email;
      this.editingPhone = user.phone || '';
      this.isEditingProfile = true;
    }
  }

  updateUser(): void {
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

    if (this.editingUserId) {
      const userData = {
        name: this.editingName,
        phone: this.editingPhone || null
      };
      this.adminService.updateUser(this.editingUserId, userData);
      this.cancelEditUser();
    }
  }

  cancelEditUser(): void {
    this.isEditingProfile = false;
    this.editingUserId = null;
    this.editingName = '';
    this.editingEmail = '';
    this.editingPhone = '';
  }

  deleteUser(userId: string | number): void {
    if (confirm('Are you sure you want to delete this user account?')) {
      this.adminService.deleteUser(String(userId));
    }
  }

  editAdminProfile(): void {
    const user = this.authService.user();
    if (user) {
      this.editingUserId = 'self';
      this.editingName = user.name;
      this.editingEmail = user.email;
      this.editingPhone = user.phone || '';
      this.isEditingProfile = true;
    }
  }

  deleteMyProfile(): void {
    if (confirm('Are you sure you want to delete your admin profile? This action cannot be undone.')) {
      this.logout();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
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
}
