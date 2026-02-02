import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ No external components imported
  templateUrl: './teacher-dashboard.component.html',
  styles: [`:host { display: block; }`]
})
export class TeacherDashboardComponent implements OnInit {
  
  // Data Variables
  myCourses: any[] = [];
  requests: any[] = [];
  loading: boolean = true;
  userParams: any = {};
  
  // UI State
  activeTab: string = 'courses'; // 'courses' | 'requests' | 'profile'
  searchTerm: string = '';
  isDarkMode: boolean = false;
  
  // Track broken images
  failedImageIds: Set<number> = new Set(); 

  private courseService = inject(CourseService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  // 🔥 Real-time Search Logic
  get filteredCourses() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return this.myCourses;
    }
    const term = this.searchTerm.toLowerCase().trim();
    return this.myCourses.filter(c => 
      c.title.toLowerCase().includes(term) || 
      c.subject.toLowerCase().includes(term)
    );
  }

  ngOnInit() {
    // 1. Get User
    const userStr = localStorage.getItem('user');
    if (userStr) this.userParams = JSON.parse(userStr);
    
    // 2. Check Theme
    if (localStorage.getItem('theme') === 'dark') this.isDarkMode = true;

    // 3. Load Data
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    // Fetch Teacher Courses
    this.courseService.getTeacherCourses(this.userParams.id).subscribe({
      next: (res: any) => {
        this.myCourses = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });

    // Fetch Requests
    this.courseService.getTeacherRequests(this.userParams.id).subscribe({
      next: (res: any) => this.requests = res
    });
  }

  // --- ACTIONS ---

  createCourse() {
    this.toastr.success('Opening Course Creator Wizard...', 'New Course');
  }

  onEditCourse(courseId: number) {
    this.toastr.info(`Editing Course #${courseId}`, 'Edit Mode');
  }

  approveRequest(id: number) {
    this.toastr.success('Student Enrolled Successfully', 'Approved');
    this.requests = this.requests.filter(r => r.id !== id);
    // Call API here to update DB
  }

  rejectRequest(id: number) {
    this.toastr.warning('Request Rejected', 'Rejected');
    this.requests = this.requests.filter(r => r.id !== id);
  }

  // --- UI & NAVIGATION ---

  switchTab(tab: string) {
    this.activeTab = tab;
    if (tab !== 'courses') this.searchTerm = ''; // Reset search
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // --- IMAGE HELPERS (Directly inside component) ---

  getCourseImage(subject: string): string {
    if (!subject) return '';
    const key = subject.trim().toLowerCase();
    const images: any = {
      'programming': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'web dev': 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
      'mathematics': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      'science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      'history': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
      'marketing': 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80',
      'design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
      'default': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b955?auto=format&fit=crop&w=800&q=80'
    };
    return images[key] || images['default'];
  }

  handleImageError(courseId: number) {
    this.failedImageIds.add(courseId);
  }

  getFallbackGradient(subject: string): string {
    const key = subject?.trim().toLowerCase();
    switch (key) {
      case 'programming': return 'bg-gradient-to-br from-emerald-500 to-teal-600'; // Green for Teacher
      case 'mathematics': return 'bg-gradient-to-br from-blue-500 to-cyan-600';
      case 'design': return 'bg-gradient-to-br from-fuchsia-500 to-purple-600';
      case 'marketing': return 'bg-gradient-to-br from-orange-500 to-red-600';
      default: return 'bg-gradient-to-br from-slate-500 to-slate-700';
    }
  }

  getBadgeColor(subject: string): string {
    return 'bg-white/90 text-slate-800 border-white/50'; // Simple unified badge style
  }
}