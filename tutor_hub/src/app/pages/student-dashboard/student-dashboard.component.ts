import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../../services/course.service';

import { MyRequestsComponent } from './components/my-requests/my-requests.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { DashboardNavbarComponent } from '../../components/dashboard-navbar/dashboard-navbar.component';
// ✅ Import Course Card
import { CourseCardComponent } from '../../components/course-card/course-card.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    DashboardNavbarComponent, 
    CourseCardComponent, // ✅ Add to imports
    MyRequestsComponent, 
    StudentProfileComponent
  ],
  templateUrl: './student-dashboard.component.html',
  styles: [`:host { display: block; }`]
})
export class StudentDashboardComponent implements OnInit {
  courses: any[] = [];
  myRequests: any[] = [];
  loading: boolean = true;
  userParams: any = {}; 
  activeTab: string = 'explore';
  searchTerm: string = '';
  isDarkMode: boolean = false;
  requestedCourseIds: Set<number> = new Set();
  
  // 🗑️ Removed: failedImageIds set (now handled inside card)

  private courseService = inject(CourseService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  get filteredCourses() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return this.courses;
    }
    const term = this.searchTerm.toLowerCase().trim();
    return this.courses.filter(course => 
      course.title?.toLowerCase().includes(term) || 
      course.subject?.toLowerCase().includes(term) ||
      course.instructor_name?.toLowerCase().includes(term)
    );
  }

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      this.userParams = Array.isArray(parsedUser) ? parsedUser[0] : parsedUser;
    }
    if (localStorage.getItem('theme') === 'dark') {
      this.isDarkMode = true;
    }
    this.loadCourses();
    this.loadMyRequests(); 
  }

  updateDashboardProfile(updatedData: any) {
    this.userParams = { ...this.userParams, ...updatedData };
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'requested') {
      this.loadMyRequests();
    }
    if (tab !== 'explore') {
      this.searchTerm = '';
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // --- API Functions ---
  loadCourses() {
    this.loading = true;
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courses = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadMyRequests() {
    this.courseService.getMyRequests().subscribe({
      next: (res: any) => {
        this.myRequests = res;
        res.forEach((req: any) => this.requestedCourseIds.add(req.course_id));
      }
    });
  }

  onRequest(courseId: number) {
    if (this.requestedCourseIds.has(courseId)) return;

    this.courseService.requestEnrollment(courseId, this.userParams.id).subscribe({
      next: () => {
        this.toastr.success('Request Sent Successfully!', 'Done');
        this.requestedCourseIds.add(courseId);
        this.loadMyRequests();
      },
      error: (err) => {
        this.toastr.info(err.error.message || 'Already requested', 'Info');
        if(err.error.message?.includes('already')) {
           this.requestedCourseIds.add(courseId);
        }
      }
    });
  }

  // 🗑️ Removed: Helper functions (getCourseImage, etc.) moved to course-card
}