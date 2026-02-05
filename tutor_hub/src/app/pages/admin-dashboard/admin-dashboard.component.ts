import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { SweetToastService } from '../../services/sweet-toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  adminService = inject(AdminService);
  router = inject(Router);
  toast = inject(SweetToastService);

  stats = signal<any>({ total_students: 0, total_teachers: 0, total_courses: 0 });
  studentsList = signal<any[]>([]);
  teachersList = signal<any[]>([]);
  
  activeTab = signal<'students' | 'teachers'>('students');
  
  showModal = signal<boolean>(false);
  selectedUser = signal<any>(null);

  showCourseModal = signal<boolean>(false);
  selectedCourse = signal<any>(null);

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      this.toast.error("Access Denied! Admins only. 🚫");
      this.router.navigate(['/login']);
      return;
    }
    this.loadAllData();
  }

  loadAllData() {
    this.adminService.getStats().subscribe({
        next: (res: any) => this.stats.set(res)
    });
    this.adminService.getStudents().subscribe({
        next: (res: any) => this.studentsList.set(res)
    });
    this.adminService.getTeachers().subscribe({
        next: (res: any) => this.teachersList.set(res)
    });
  }

  async deleteUser(userId: number, role: string) {
    const isConfirmed = await this.toast.confirm(
        `Delete ${role}?`, 
        `Are you sure you want to delete this ${role}? This action cannot be undone.`, 
        'Yes, Delete it!', 
        '#d33' 
    );
    if (isConfirmed) {
        this.adminService.deleteUser(userId).subscribe({
            next: () => {
                this.toast.success(`${role} deleted successfully 🗑️`);
                this.loadAllData(); 
            },
            error: () => this.toast.error("Error deleting user ❌")
        });
    }
  }

  viewProfile(user: any) {
    this.selectedUser.set(user);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedUser.set(null);
  }

  viewCourse(courseName: string, teacher: any) {
    this.adminService.getCourseDetails(courseName.trim(), teacher.id).subscribe({
      next: (res: any) => {
        this.selectedCourse.set(res);
        this.showCourseModal.set(true);
      },
      error: () => this.toast.error("Course details not found ❌")
    });
  }

  closeCourseModal() {
    this.showCourseModal.set(false);
    this.selectedCourse.set(null);
  }

  async removeCourse(courseId: number) {
    const isConfirmed = await this.toast.confirm(
      'Remove Course?',
      'This course will be permanently deleted from the database.',
      'Yes, Remove it!',
      '#e11'
    );
    if (isConfirmed) {
      this.adminService.deleteCourse(courseId).subscribe({
        next: () => {
          this.toast.success("Course removed successfully ✅");
          this.closeCourseModal();
          this.loadAllData();
        },
        error: () => this.toast.error("Failed to remove course ❌")
      });
    }
  }

  logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.toast.success("Logged out successfully 👋");
      this.router.navigate(['/']);
  }
}