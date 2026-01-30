import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styles: []
})
export class StudentDashboardComponent implements OnInit {
  courses: any[] = [];
  loading: boolean = true;
  userParams: any = {};
  activeTab: string = 'explore';
  searchTerm: string = '';

  private courseService = inject(CourseService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) this.userParams = JSON.parse(userStr);
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courses = res;
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load courses');
        this.loading = false;
      }
    });
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  onRequest(courseId: number) {
    this.courseService.requestEnrollment(courseId).subscribe({
      next: (res) => {
        this.toastr.success('Request sent successfully!', 'On the way');
      },
      error: (err) => {
        this.toastr.info(err.error.message || 'Already requested', 'Check Status');
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // === 🎨 CREATIVE LOGIC STARTS HERE ===

  // 1. Smart Image Mapping (Based on Subject)
  getCourseImage(subject: string): string {
    const images: any = {
      'Programming': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'Mathematics': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      'Science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      'English': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
      'History': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
      'Music': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
      'Design': 'https://images.unsplash.com/photo-1626785774573-4b799314346d?auto=format&fit=crop&w=800&q=80',
      'Marketing': 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80',
      'Default': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b955?auto=format&fit=crop&w=800&q=80'
    };
    return images[subject] || images['Default'];
  }

  // 2. Dynamic Badge Colors
  getBadgeColor(subject: string): string {
    const colors: any = {
      'Programming': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Mathematics': 'bg-blue-100 text-blue-700 border-blue-200',
      'Science': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'English': 'bg-rose-100 text-rose-700 border-rose-200',
      'Music': 'bg-amber-100 text-amber-700 border-amber-200',
      'History': 'bg-orange-100 text-orange-700 border-orange-200',
      'Default': 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return colors[subject] || colors['Default'];
  }
}