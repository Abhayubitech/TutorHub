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
      question: 'What is TutorHub?',
      answer: 'TutorHub is a complete tutoring platform that connects students with teachers. It features course management, enrollment workflows, WhatsApp integration for group learning, and payment verification system.'
    },
    {
      question: 'How do I sign up for TutorHub?',
      answer: 'You can sign up as a Student, Teacher, or Admin. Simply click the Sign Up button, provide your name, email, password, and phone number. Teachers can also add their qualifications and experience.'
    },
    {
      question: 'How do students find and enroll in courses?',
      answer: 'Students can browse all available courses, search by subject, view teacher profiles, and request enrollment. After request approval, students get access to course WhatsApp groups and can upload payment screenshots for verification.'
    },
    {
      question: 'How do teachers create and manage courses?',
      answer: 'Teachers can create courses with subjects, descriptions, fees, and schedules (online/offline/hybrid modes). They can manage WhatsApp groups (demo and approved), review enrollment requests, and verify student payments.'
    },
    {
      question: 'What is the WhatsApp integration feature?',
      answer: 'TutorHub includes WhatsApp group management with two types: Demo groups (free access with zoom links and payment info) and Approved groups (access after payment verification). Teachers can manage group members and share learning resources.'
    },
    {
      question: 'How does payment verification work?',
      answer: 'Students upload payment screenshots through the platform. Teachers review these screenshots, can approve or reject payments with notes, and grant access to premium WhatsApp groups upon successful verification.'
    },
    {
      question: 'What are the course modes available?',
      answer: 'Courses support three modes: Online, Offline, and Hybrid. Teachers can set course fees, start/end dates, maximum student limits, and create detailed schedules with specific days and times.'
    },
    {
      question: 'Is my data secure on TutorHub?',
      answer: 'Yes, TutorHub uses industry-standard security including bcrypt password hashing, JWT authentication, parameterized SQL queries, and comprehensive input validation on both frontend and backend.'
    },
    {
      question: 'What technologies power TutorHub?',
      answer: 'TutorHub is built with Angular 19 (frontend), Node.js/Express (backend), MySQL (database), and features modern web technologies like Angular Signals for reactive state management and responsive design.'
    },
    {
      question: 'How can I contact support?',
      answer: 'You can reach out through the Contact page on the platform. Our team is available to help with any questions about courses, enrollment, payments, or technical issues.'
    }
  ];

  toggleAnswer(index: number) {
    const element = document.getElementById(`faq-answer-${index}`);
    if (element) {
      element.classList.toggle('active');
    }
  }
}
