import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  totalUsers = 0;
  studentCount = 0;
  teacherCount = 0;
  courseCount = 0;
  userFilter: 'all' | 'student' | 'teacher' = 'all';
  
  users: User[] = [
    {
      id: 1,
      name: 'John Student',
      email: 'john@example.com',
      role: 'student',
      phone: '+1 (555) 111-1111'
    },
    {
      id: 2,
      name: 'Jane Teacher',
      email: 'jane@example.com',
      role: 'teacher',
      phone: '+1 (555) 222-2222'
    },
    {
      id: 3,
      name: 'Mike Student',
      email: 'mike@example.com',
      role: 'student',
      phone: '+1 (555) 333-3333'
    },
    {
      id: 4,
      name: 'Sarah Teacher',
      email: 'sarah@example.com',
      role: 'teacher',
      phone: '+1 (555) 444-4444'
    },
  ];

  filteredUsers: User[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.isAuthenticated() || this.authService.user()?.role !== 'admin') {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.loadStats();
    this.filterUsers('all');
  }

  loadStats(): void {
    this.totalUsers = this.users.length;
    this.studentCount = this.users.filter(u => u.role === 'student').length;
    this.teacherCount = this.users.filter(u => u.role === 'teacher').length;
    this.courseCount = 12; // This would come from an API in a real app
  }

  filterUsers(filter: 'all' | 'student' | 'teacher'): void {
    this.userFilter = filter;
    if (filter === 'all') {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(u => u.role === filter);
    }
  }

  editUser(userId: number): void {
    console.log('Edit user:', userId);
    // Implement user edit functionality
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user account?')) {
      this.users = this.users.filter(u => u.id !== userId);
      this.loadStats();
      this.filterUsers(this.userFilter);
      console.log('User deleted:', userId);
    }
  }

  editAdminProfile(): void {
    console.log('Edit admin profile');
    // Implement admin profile edit functionality
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
}
