import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './earnings.component.html',
  styleUrl: './earnings.component.css'
})
export class EarningsComponent {
  earningsData = {
    averageHourlyRate: 500,
    topEarners: 2000,
    paymentSchedule: 'Weekly',
    paymentMethod: 'Bank Transfer'
  };

  hourlyRate: number = 500;
  hoursPerWeek: number = 10;
  weeksPerMonth: number = 4;

  get weeklyEarnings(): number {
    return this.hourlyRate * this.hoursPerWeek;
  }

  get monthlyEarnings(): number {
    return this.weeklyEarnings * this.weeksPerMonth;
  }

  get afterCommission(): number {
    return Math.round(this.monthlyEarnings * 0.8);
  }

  benefits = [
    {
      title: 'Competitive Rates',
      description: 'Set your own rates and earn what you deserve',
      icon: 'fas fa-coins'
    },
    {
      title: 'Flexible Schedule',
      description: 'Teach when you want and how much you want',
      icon: 'fas fa-clock'
    },
    {
      title: 'Bonuses & Rewards',
      description: 'Earn bonuses for excellent performance and student reviews',
      icon: 'fas fa-trophy'
    },
    {
      title: 'Growth Opportunities',
      description: 'Increase your earnings as you gain experience and positive reviews',
      icon: 'fas fa-chart-line'
    }
  ];

  paymentInfo = [
    {
      title: 'Payment Schedule',
      content: 'Payments are processed every week on Fridays for completed sessions',
      icon: 'fas fa-calendar-alt'
    },
    {
      title: 'Payment Methods',
      content: 'Direct bank transfer to your registered account',
      icon: 'fas fa-university'
    },
    {
      title: 'Commission',
      content: 'TutorHub charges a 20% commission on all completed sessions',
      icon: 'fas fa-percentage'
    },
    {
      title: 'Taxes',
      content: 'You are responsible for your own tax declarations and payments',
      icon: 'fas fa-file-invoice-dollar'
    }
  ];
}
