import { Component, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-form-modal-component.component.html',
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
  `]
})
export class CourseFormModalComponent {
  courseData = input<any>(null);
  isSaving = input<boolean>(false);
  
  close = output<void>();
  save = output<any>();

  // ✅ Added 'schedule'
  form: any = { 
    title: '', 
    subject: '', 
    price: null, 
    schedule: '', 
    description: '' 
  };

  
  
  constructor() {
    // console.log(courseData);
    effect(() => {
      if (this.courseData()) {
        this.form = { ...this.courseData() };
      } else {
        this.resetForm();
      }
    });
  }

  resetForm() {
    // ✅ Added 'schedule'
    this.form = { 
      title: '', 
      subject: '', 
      price: null, 
      schedule: '', 
      description: '' 
    };
  }

  onSubmit() {
    // Ensure schedule is part of the saved data
    if (this.form.title && this.form.subject && this.form.price) {
      this.save.emit(this.form);
    }
  }
}