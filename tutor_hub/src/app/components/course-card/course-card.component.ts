import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card.component.html',
  styles: []
})
export class CourseCardComponent {
  // ✅ INPUTS
  course = input.required<any>(); // The course data
  isRequested = input<boolean>(false); // State: Is the button disabled/requested?

  // ✅ OUTPUTS
  action = output<number>(); // Event when button is clicked

  // ✅ INTERNAL STATE
  // Instead of a Set of IDs, each card manages its own error state
  imageFailed = signal<boolean>(false);

  // ✅ FIX: Ye Input Missing tha!
  // Default value 'Enroll Now' rakhi hai taaki student dashboard me code na fate
  actionLabel = input<string>('Enroll Now');

  onAction() {
    this.action.emit(this.course().id);
  }

  handleImageError() {
    this.imageFailed.set(true);
  }

  // --- HELPER FUNCTIONS (Moved from Dashboard) ---

  getCourseImage(subject: string): string {
    if (!subject) return '';
    const key = subject.trim().toLowerCase();
    const images: any = {
      'programming': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'web dev': 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
      'web development': 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
      'data science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'mathematics': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      'maths': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      'science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      'physics': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
      'english': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
      'music': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
      'history': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
      'marketing': 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80',
      'design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
      'graphic design': 'https://images.unsplash.com/photo-1626785774573-4b799314346d?auto=format&fit=crop&w=800&q=80',
      'business': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'default': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b955?auto=format&fit=crop&w=800&q=80'
    };
    return images[key] || images['default'];
  }

  getFallbackGradient(subject: string): string {
    const key = subject?.trim().toLowerCase();
    switch (key) {
      case 'programming': case 'web dev': return 'bg-gradient-to-br from-indigo-500 to-purple-600';
      case 'mathematics': return 'bg-gradient-to-br from-blue-500 to-cyan-600';
      case 'science': case 'physics': return 'bg-gradient-to-br from-emerald-500 to-teal-600';
      case 'music': return 'bg-gradient-to-br from-rose-500 to-pink-600';
      case 'history': return 'bg-gradient-to-br from-amber-600 to-orange-700';
      case 'marketing': case 'business': return 'bg-gradient-to-br from-blue-600 to-indigo-700';
      case 'design': case 'graphic design': return 'bg-gradient-to-br from-fuchsia-500 to-purple-600';
      case 'english': return 'bg-gradient-to-br from-red-400 to-rose-500';
      default: return 'bg-gradient-to-br from-slate-500 to-slate-700';
    }
  }

  getBadgeColor(subject: string): string {
    const colors: any = {
      'Programming': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Mathematics': 'bg-blue-100 text-blue-700 border-blue-200',
      'Science': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Design': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
      'Marketing': 'bg-orange-100 text-orange-700 border-orange-200',
      'Default': 'bg-slate-100 text-slate-700 border-slate-200'
    };
    const key = Object.keys(colors).find(k => k.toLowerCase() === subject?.toLowerCase()) || 'Default';
    return colors[key];
  }
}