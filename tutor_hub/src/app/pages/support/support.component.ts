import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {
  supportCategories = [
    {
      title: 'Technical Issues',
      description: 'Problems with platform functionality, login issues, or technical errors',
      icon: 'fas fa-cog',
      responseTime: '2-4 hours',
      availability: '24/7'
    },
    {
      title: 'Account & Billing',
      description: 'Questions about payments, refunds, subscriptions, and account management',
      icon: 'fas fa-credit-card',
      responseTime: '1-2 business days',
      availability: 'Mon-Fri 9AM-6PM'
    },
    {
      title: 'Tutor Related',
      description: 'Issues with tutors, session scheduling, or quality concerns',
      icon: 'fas fa-chalkboard-teacher',
      responseTime: '4-6 hours',
      availability: 'Mon-Sat 8AM-8PM'
    },
    {
      title: 'General Inquiries',
      description: 'Other questions about our services, policies, or features',
      icon: 'fas fa-info-circle',
      responseTime: '24 hours',
      availability: 'Mon-Fri 9AM-6PM'
    }
  ];

  contactInfo = {
    email: 'support@tutorhub.com',
    phone: '+91 9630079633',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM IST'
  };
}
