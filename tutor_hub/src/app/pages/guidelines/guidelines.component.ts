import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-guidelines',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './guidelines.component.html',
  styleUrl: './guidelines.component.css'
})
export class GuidelinesComponent {
  guidelines = [
    {
      title: 'Professional Conduct',
      description: 'Maintain professional behavior in all interactions with students and parents.',
      rules: [
        'Be punctual for all scheduled sessions',
        'Communicate respectfully and professionally',
        'Maintain appropriate boundaries with students',
        'Dress appropriately for video sessions'
      ]
    },
    {
      title: 'Teaching Standards',
      description: 'Follow our established teaching standards to ensure quality education.',
      rules: [
        'Prepare lesson plans in advance',
        'Use age-appropriate teaching methods',
        'Provide constructive feedback',
        'Track student progress regularly'
      ]
    },
    {
      title: 'Platform Usage',
      description: 'Use our platform responsibly and follow technical guidelines.',
      rules: [
        'Test your equipment before sessions',
        'Use only approved teaching tools',
        'Maintain stable internet connection',
        'Report technical issues promptly'
      ]
    },
    {
      title: 'Privacy & Security',
      description: 'Protect student information and maintain confidentiality.',
      rules: [
        'Never share personal contact information',
        'Keep student data confidential',
        'Use secure payment methods only',
        'Report security concerns immediately'
      ]
    }
  ];
}
