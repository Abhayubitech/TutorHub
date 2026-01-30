import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // 1. Ye import hona chahiye
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StudentDashboardComponent], // 2. Yaha add karein
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tutor_hub';
}