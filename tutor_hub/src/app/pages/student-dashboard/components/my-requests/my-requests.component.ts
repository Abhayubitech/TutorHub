import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CourseService } from '../../../services/course.service'; // Path check kr lena
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './my-requests.component.html',
  styles: []
})
export class MyRequestsComponent implements OnInit {
  requests: any[] = [];
  loading: boolean = true;

  private courseService = inject(CourseService);
  private toastr = inject(ToastrService);

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.courseService.getMyRequests().subscribe({
      next: (res: any) => {
        this.requests = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to load requests');
        this.loading = false;
      }
    });
  }

  // ✨ Status Badge Color Logic
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
      case 'rejected':
        return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800';
      case 'pending':
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
    }
  }

  // ✨ Subject Icon Color Logic
  getSubjectColor(subject: string): string {
    const colors: any = {
      'Programming': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
      'Mathematics': 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
      'Science': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
      'Default': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
    };
    return colors[subject] || colors['Default'];
  }
}