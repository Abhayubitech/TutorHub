import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent {
  resources = [
    {
      title: 'Teaching Materials',
      description: 'Access a comprehensive library of teaching resources, lesson plans, and educational materials.',
      icon: 'fas fa-book-open',
      category: 'Teaching',
      downloads: Math.floor(Math.random() * 500) + 100,
      rating: (Math.random() * 2 + 3).toFixed(1)
    },
    {
      title: 'Professional Development',
      description: 'Enhance your teaching skills with our professional development courses and workshops.',
      icon: 'fas fa-graduation-cap',
      category: 'Development',
      downloads: Math.floor(Math.random() * 500) + 100,
      rating: (Math.random() * 2 + 3).toFixed(1)
    },
    {
      title: 'Classroom Tools',
      description: 'Discover digital tools and software to make your online teaching more effective.',
      icon: 'fas fa-tools',
      category: 'Tools',
      downloads: Math.floor(Math.random() * 500) + 100,
      rating: (Math.random() * 2 + 3).toFixed(1)
    },
    {
      title: 'Student Engagement',
      description: 'Learn strategies and techniques to keep your students engaged and motivated.',
      icon: 'fas fa-users',
      category: 'Engagement',
      downloads: Math.floor(Math.random() * 500) + 100,
      rating: (Math.random() * 2 + 3).toFixed(1)
    },
    {
      title: 'Assessment Methods',
      description: 'Explore various assessment techniques to evaluate student progress effectively.',
      icon: 'fas fa-clipboard-check',
      category: 'Assessment',
      downloads: Math.floor(Math.random() * 500) + 100,
      rating: (Math.random() * 2 + 3).toFixed(1)
    },
    {
      title: 'Curriculum Design',
      description: 'Get guidance on designing effective curricula for different subjects and age groups.',
      icon: 'fas fa-project-diagram',
      category: 'Curriculum',
      downloads: Math.floor(Math.random() * 500) + 100,
      rating: (Math.random() * 2 + 3).toFixed(1)
    }
  ];
}
