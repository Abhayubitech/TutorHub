import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-course-create',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="p-6 max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Create New Course</h2>
      <form [formGroup]="courseForm" (ngSubmit)="onSubmit()" class="bg-white p-6 rounded shadow-md">
        <div class="mb-4">
          <label class="block text-gray-700">Subject</label>
          <input formControlName="subject" type="text" class="w-full p-2 border rounded mt-1">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Description</label>
          <textarea formControlName="description" class="w-full p-2 border rounded mt-1" rows="3"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
             <div>
                <label class="block text-gray-700">Fee</label>
                <input formControlName="fee" type="number" class="w-full p-2 border rounded mt-1">
             </div>
             <div>
                <label class="block text-gray-700">Mode</label>
                <select formControlName="mode" class="w-full p-2 border rounded mt-1">
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                </select>
             </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-6">
             <div>
                <label class="block text-gray-700">Start Date</label>
                <input formControlName="start_date" type="date" class="w-full p-2 border rounded mt-1">
             </div>
             <div>
                <label class="block text-gray-700">End Date</label>
                <input formControlName="end_date" type="date" class="w-full p-2 border rounded mt-1">
             </div>
        </div>
        <button type="submit" [disabled]="courseForm.invalid" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300">
          Create Course
        </button>
      </form>
    </div>
  `
})
export class CourseCreateComponent {
    fb = inject(FormBuilder);
    courseService = inject(CourseService);
    router = inject(Router);

    courseForm = this.fb.group({
        subject: ['', Validators.required],
        description: [''],
        fee: [0, [Validators.required, Validators.min(0)]],
        mode: ['online', Validators.required],
        start_date: ['', Validators.required],
        end_date: ['', Validators.required]
    });

    onSubmit() {
        if (this.courseForm.valid) {
            this.courseService.createCourse(this.courseForm.value).subscribe({
                next: () => {
                    alert('Course created successfully!');
                    this.router.navigate(['/dashboard']);
                },
                error: (err) => alert('Error: ' + err.message)
            });
        }
    }
}
