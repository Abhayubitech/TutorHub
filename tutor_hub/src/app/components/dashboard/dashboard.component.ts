import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { RequestService } from '../../services/request.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Welcome, {{ authService.currentUser()?.name }}!</h1>
      
      @if (authService.currentUser()?.role === 'teacher') {
        <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">Actions</h2>
            <a routerLink="/create-course" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create New Course</a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h2 class="text-xl font-semibold mb-4">My Courses</h2>
                 @for (course of myCourses; track course.id) {
                    <div class="bg-white p-4 rounded shadow mb-2 border-l-4 border-blue-500">
                        <h3 class="font-bold">{{ course.subject }}</h3>
                        <p class="text-sm text-gray-600">{{ course.mode }} - {{ course.start_date | date }}</p>
                    </div>
                 } @empty {
                    <p class="text-gray-500">No courses created yet.</p>
                 }
            </div>
            <div>
                <h2 class="text-xl font-semibold mb-4">Pending Requests</h2>
                 @for (req of requests; track req.id) {
                    <div class="bg-white p-4 rounded shadow mb-2 flex justify-between items-center border-l-4 border-yellow-500">
                        <div>
                            <p class="font-bold">{{ req.student_name }}</p>
                            <p class="text-sm text-gray-600">Wants to join: {{ req.subject }}</p>
                        </div>
                        <div class="space-x-2">
                            <button (click)="approveRequest(req.id)" class="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Approve</button>
                            <button (click)="rejectRequest(req.id)" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Reject</button>
                        </div>
                    </div>
                 } @empty {
                    <p class="text-gray-500">No pending requests.</p>
                 }
            </div>
        </div>
      }

      @if (authService.currentUser()?.role === 'student') {
        <div class="mb-8">
             <a routerLink="/courses" class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">Browse All Courses</a>
        </div>

        <div>
            <h2 class="text-xl font-semibold mb-4">My Enrollments</h2>
            @for (enrollment of enrollments; track enrollment.id) {
                <div class="bg-white p-4 rounded shadow mb-2 border-l-4 border-green-500">
                    <h3 class="font-bold">{{ enrollment.subject }}</h3>
                    <p>Instructor: {{ enrollment.teacher_name }}</p>
                    <p class="text-sm text-gray-600">{{ enrollment.mode }} | {{ enrollment.description }}</p>
                </div>
            } @empty {
                <p class="text-gray-500">You are not enrolled in any courses.</p>
            }
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
    authService = inject(AuthService);
    courseService = inject(CourseService);
    requestService = inject(RequestService);

    myCourses: any[] = [];
    requests: any[] = [];
    enrollments: any[] = [];

    ngOnInit() {
        const role = this.authService.currentUser()?.role;
        if (role === 'teacher') {
            this.loadTeacherData();
        } else if (role === 'student') {
            this.loadStudentData();
        }
    }

    loadTeacherData() {
        this.courseService.getMyCourses().subscribe(data => this.myCourses = data);
        this.refreshRequests();
    }

    loadStudentData() {
        this.requestService.getMyEnrollments().subscribe(data => this.enrollments = data);
    }

    refreshRequests() {
        this.requestService.getTeacherRequests().subscribe(data => this.requests = data);
    }

    approveRequest(id: number) {
        this.requestService.updateRequestStatus(id, 'approved').subscribe(() => this.refreshRequests());
    }

    rejectRequest(id: number) {
        this.requestService.updateRequestStatus(id, 'rejected').subscribe(() => this.refreshRequests());
    }
}
