import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-detail-modal.component.html',
  styles: []
})
export class CourseDetailModalComponent {
  // ✅ Data Input from Parent
  course = input.required<any>(); 
  
  // ✅ Event to close modal
  close = output<void>();

  // --- Helper Function for Images (Same as Card) ---
  getCourseImage(subject: string): string {
    if (!subject) return 'https://images.unsplash.com/photo-1524178232363-1fb2b075b955?auto=format&fit=crop&w=800&q=80';
    const key = subject.trim().toLowerCase();
    
    const images: any = {
      'programming': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'web dev': 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
      'data science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'mathematics': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      'design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80'
    };

    // Partial match check
    const match = Object.keys(images).find(k => key.includes(k));
    return match ? images[match] : 'https://images.unsplash.com/photo-1524178232363-1fb2b075b955?auto=format&fit=crop&w=800&q=80';
  }
}