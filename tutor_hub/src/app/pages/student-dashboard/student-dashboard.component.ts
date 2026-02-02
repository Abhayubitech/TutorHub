import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MyRequestsComponent } from './components/my-requests/my-requests.component'; // Path check karein
import { ProfileService } from '../../services/profile.service';
import { StudentProfileComponent } from './components/student-profile/student-profile.component'; // Path check karein

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MyRequestsComponent, StudentProfileComponent],
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
  
  // Is Set se hum track karenge ki user ne kis kis course par click kiya hai
  requestedCourseIds: Set<number> = new Set(); 

  private courseService = inject(CourseService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private profileService = inject(ProfileService); // <--- Use ProfileService
  profileData: any;
  isEditing: boolean | undefined;

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) this.userParams = JSON.parse(userStr);
    
    // Check Theme
    if (localStorage.getItem('theme') === 'dark') {
      this.isDarkMode = true;
    }

    // Load Data
    this.loadCourses();
    this.loadMyRequests(); // Pehle se bheji hui requests load karo taaki unke buttons disabled rahein
    console.log(this.userParams);
    
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
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // --- API CALLS ---

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
        // Jo requests database mein hain, unhe Set mein daal do taaki button disabled dikhein
        res.forEach((req: any) => this.requestedCourseIds.add(req.course_id));
      }
    });
  }

  // ✨ ENROLL BUTTON CLICK LOGIC
  onRequest(courseId: number ) {
    if (this.requestedCourseIds.has(courseId)) return; // Agar already sent hai to ignore karo

    
    this.courseService.requestEnrollment(courseId,this.userParams[0].id).subscribe({
      next: () => {
        this.toastr.success('Request Sent Successfully!', 'Done');
        
        // 1. Button ko turant disable karne ke liye ID add karo
        this.requestedCourseIds.add(courseId);
        
        // 2. Background mein list update kar lo
        this.loadMyRequests();
      },
      error: (err) => {
        this.toastr.info(err.error.message || 'Already requested', 'Info');
        // Error agar duplicate ka hai, tab bhi button disable kar do
        if(err.error.message?.includes('already')) {
           this.requestedCourseIds.add(courseId);
        }
      }
    });
  }

  fetchProfile() {
    this.loading = true;
    // Call method from profileService
    this.profileService.getStudentProfile().subscribe({
      next: (res: any) => {
        this.profileData = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  saveProfile() {
    this.loading = true;
    // Call method from profileService
    this.profileService.updateStudentProfile(this.profileData).subscribe({
      next: (res: any) => {
        this.toastr.success('Profile Updated Successfully');
        this.isEditing = false;
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to update profile');
        this.loading = false;
      }
    });
  }

  // --- Helpers ---
  getCourseImage(subject: string): string {
    const images: any = {
      'Programming': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'Mathematics': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      'Science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      'English': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
      'Default': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b955?auto=format&fit=crop&w=800&q=80'
    };
    return images[subject] || images['Default'];
  }

  getBadgeColor(subject: string): string {
    const colors: any = {
      'Programming': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Mathematics': 'bg-blue-100 text-blue-700 border-blue-200',
      'Default': 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return colors[subject] || colors['Default'];
  }
}