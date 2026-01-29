import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { RequestService } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-course-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Available Courses</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (course of courses; track course.id) {
            <div class="bg-white p-6 rounded shadow-md border hover:shadow-lg transition">
                <h3 class="text-xl font-bold text-blue-600">{{ course.subject }}</h3>
                <p class="text-sm text-gray-500 mb-2">by {{ course.teacher_name }}</p>
                <p class="text-gray-700 mb-4">{{ course.description }}</p>
                
                <div class="flex justify-between items-center text-sm font-semibold text-gray-600 mb-4">
                    <span>{{ course.mode | titlecase }}</span>
                    <span>\${{ course.fee }}</span>
                </div>

                @if (authService.currentUser()?.role === 'student') {
                    <button (click)="requestToJoin(course.id)" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        Request to Join
                    </button>
                }
            </div>
        } @empty {
            <p class="col-span-3 text-center text-gray-500">No courses available at the moment.</p>
        }
      </div>
    </div>
  `
})
export class CourseListComponent implements OnInit {
    courseService = inject(CourseService);
    requestService = inject(RequestService);
    authService = inject(AuthService);

    courses: any[] = [];

    ngOnInit() {
        this.courseService.getAllCourses().subscribe(data => this.courses = data);
    }

    requestToJoin(courseId: number) {
        if (!confirm('Are you sure you want to send a request for this course?')) return;

        this.requestService.createRequest(courseId).subscribe({
            next: () => alert('Request sent successfully!'),
            error: (err) => alert('Failed to send request: ' + err.error.error)
        });
    }
}
