import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  faqs = [
    {
      question: 'How do I find a tutor?',
      answer: 'You can browse through our list of qualified tutors, filter by subject, and view their profiles to find the perfect match for your learning needs.'
    },
    {
      question: 'What are the payment methods?',
      answer: 'We accept various payment methods including credit/debit cards, net banking, and popular digital wallets. All payments are secure and processed through encrypted channels.'
    },
    {
      question: 'Can I cancel a session?',
      answer: 'Yes, you can cancel a session up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours may incur a small fee.'
    },
    {
      question: 'How are tutors verified?',
      answer: 'All tutors go through a rigorous verification process including background checks, qualification verification, and teaching assessments.'
    },
    {
      question: 'What if I\'m not satisfied with a tutor?',
      answer: 'We offer a satisfaction guarantee. If you\'re not happy with your tutor, we can help you find a replacement or provide a refund for unused sessions.'
    }
  ];

  toggleAnswer(index: number) {
    const element = document.getElementById(`faq-answer-${index}`);
    if (element) {
      element.classList.toggle('active');
    }
  }
}
