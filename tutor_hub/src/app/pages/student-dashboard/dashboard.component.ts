import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../../services/course.service';

// Components
import { DashboardNavbarComponent } from '../../components/dashboard-navbar/dashboard-navbar.component';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
import { MyRequestsComponent } from './components/my-requests/my-requests.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { CourseFormModalComponent } from '../../components/course-form-modal-component/course-form-modal-component.component';
import { CourseDetailModalComponent } from '../../components/course-detail-modal/course-detail-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    DashboardNavbarComponent, 
    CourseCardComponent, 
    MyRequestsComponent, 
    StudentProfileComponent,
    CourseFormModalComponent,
    CourseDetailModalComponent // ✅ Ensure standalone: true inside this component file
  ],
  templateUrl: './dashboard.component.html',
  styles: [`:host { display: block; }`]
})
export class DashboardComponent implements OnInit {
  
  // Data
  courses: any[] = [];
  requests: any[] = [];
  loading: boolean = true;
  userParams: any = {}; 
  activeTab: string = '';
  searchTerm: string = '';
  isDarkMode: boolean = false;
  
  // Modal States
  isFormOpen: boolean = false; 
  editingCourse: any = null; 
  selectedCourse: any = null; 
  
  userRole: 'student' | 'teacher' = 'student';
  currentTabs: { id: string, label: string }[] = [];
  requestedCourseIds: Set<number> = new Set();
  enrolledCourses: any[] = []; // ✅ New Variable
  
  private courseService = inject(CourseService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  get filteredCourses() {
    if (!this.searchTerm) return this.courses;
    const term = this.searchTerm.toLowerCase();
    return this.courses.filter(c => c.title.toLowerCase().includes(term));
  }

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.userParams = JSON.parse(userStr);
      // Ensure safe access if userParams is array or object
      const userData = Array.isArray(this.userParams) ? this.userParams[0] : this.userParams;
      this.userRole = userData?.role === 'teacher' ? 'teacher' : 'student';
    }

    if (localStorage.getItem('theme') === 'dark') this.isDarkMode = true;
    this.setupTabs();
    this.loadData();
  }

  setupTabs() {
    if (this.userRole === 'teacher') {
      this.currentTabs = [
        { id: 'courses', label: 'My Courses' },
        { id: 'requests', label: 'Student Requests' },
        { id: 'profile', label: 'Profile' }
      ];
      this.activeTab = 'courses';
    } else {
      this.currentTabs = [
        { id: 'explore', label: 'Explore' },
        { id: 'requested', label: 'My Requests' },
        { id: 'learning', label: 'My Learning' },
        { id: 'profile', label: 'Profile' }
      ];
      this.activeTab = 'explore';
    }
  }

  loadData() {
    this.loading = true;
    const userData = Array.isArray(this.userParams) ? this.userParams[0] : this.userParams;
    // console.log(userData);
    
    const userId = userData?.id;

    if (this.userRole === 'teacher') {
      console.log(userId);
      
      this.courseService.getTeacherCourses(userId).subscribe({
        
        next: (res: any) => { this.courses = res; this.loading = false; },
        error: () => this.loading = false
      });
      this.courseService.getTeacherRequests(userId).subscribe({
        next: (res: any) => {
          this.requests = res
          console.log(res);
          
        }
        
        
      });
    } else {
      this.courseService.getAllCourses().subscribe({
        next: (res: any) => { this.courses = res; this.loading = false; },
        error: () => this.loading = false
      });
      this.courseService.getMyRequests().subscribe({
        next: (res: any) => res.forEach((req: any) => this.requestedCourseIds.add(req.course_id))
      });
  // ✅ NEW: Fetch Enrolled Courses
      this.courseService.getEnrolledCourses(userId).subscribe({
        next: (res: any) => {
            this.enrolledCourses = res; 
            console.log("Enrolled:", this.enrolledCourses);
        }
      });
    }
  }

  // --- ACTIONS ---

  onCardClick(courseId: number) {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      this.selectedCourse = course;
    }
  }

  closeModal() {
    this.selectedCourse = null;
  }

  requestEnrollment(courseId: number) {
    
    const userData = Array.isArray(this.userParams) ? this.userParams[0] : this.userParams;
    if (this.requestedCourseIds.has(courseId)) return;
    
    this.courseService.requestEnrollment(courseId, userData?.id).subscribe({
      next: () => {
        this.toastr.success('Request Sent!');
        this.requestedCourseIds.add(courseId);
      }
    });
  }

approveRequest(requestId: number) {
  // 1. Teacher ID nikalein (Login data se)
  const userData = Array.isArray(this.userParams) ? this.userParams[0] : this.userParams;
  const teacherId = userData?.id;

  this.loading = true; // Optional: Spinner show krne k liye

  // 2. Service Call
  this.courseService.updateRequestStatus( requestId, 'accepted').subscribe({
    next: (res) => {
      this.loading = false;
      this.toastr.success('Student Enrolled Successfully!');
      this.loadData()

      // ✅ FIX: 'r.id' ki jagah 'r.request_id' (Kyuki database se request_id aa rha h)
      this.requests = this.requests.filter(r => r.request_id !== requestId);
    },
    error: (err) => {
      this.loading = false;
      console.error(err);
      this.toastr.error('Something went wrong!');
    }
  });
}

rejectRequest(requestId: number) {
  if (!confirm('Are you sure you want to reject this request?')) return;

  const userData = Array.isArray(this.userParams) ? this.userParams[0] : this.userParams;
  const teacherId = userData?.id;

  this.loading = true;

  this.courseService.updateRequestStatus( requestId, 'rejected').subscribe({
    next: (res) => {
      this.loading = false;
      this.toastr.warning('Request Rejected');
       this.loadData()

      // ✅ FIX: Sahi ID se filter karein
      this.requests = this.requests.filter(r => r.request_id !== requestId);
    },
    error: (err) => {
      this.loading = false;
      console.error(err);
      this.toastr.error('Failed to reject request');
    }
  });
}

  switchTab(tab: string) { this.activeTab = tab; }
  
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  
  updateDashboardProfile(data: any) {
    this.userParams = { ...this.userParams, ...data };
  }

  createCourse() {
    this.editingCourse = null;
    this.isFormOpen = true;
  }

  onCardAction(courseId: number) {
    if (this.userRole === 'teacher') {
      const courseToEdit = this.courses.find(c => c.id === courseId);
      if (courseToEdit) {
        this.editingCourse = courseToEdit;
        this.isFormOpen = true;
      }
    } else {
      this.requestEnrollment(courseId);
    }
  }

  closeForm() {
    this.isFormOpen = false;
    this.editingCourse = null;
  }

  // ✅ Single Correct Handle Save Function
  handleCourseSave(formData: any) {
    this.loading = true;
    const userData = Array.isArray(this.userParams) ? this.userParams[0] : this.userParams;

    if (this.editingCourse) {
      // UPDATE
      this.courseService.updateCourse(parseInt(this.editingCourse.id), formData).subscribe({
        next: (response: any) => {
          this.toastr.success('Course Updated Successfully');
          const index = this.courses.findIndex(c => c.id === this.editingCourse.id);
          if (index !== -1) this.courses[index] = { ...this.courses[index], ...formData };
          this.closeForm();
          this.loading = false;
        },
        error: (err) => {
          this.toastr.error('Failed to update course');
          this.loading = false;
        }
      });
    } else {
      // CREATE
      console.log(userData);
      
      const newCoursePayload = {
        ...formData,
        created_by: userData?.id,
        instructor_name: userData?.name
      };

      this.courseService.createCourse(newCoursePayload).subscribe({
        next: (response: any) => {
          this.toastr.success('New Course Created!');
          this.courses.unshift(response); 
          this.closeForm();
          this.loading = false;
        },
        error: (err) => {
          this.toastr.error('Failed to create course');
          this.loading = false;
        }
      });
    }
  }

  
  
}