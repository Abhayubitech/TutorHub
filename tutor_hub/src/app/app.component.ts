import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // 1. Ye import hona chahiye
import { DashboardComponent } from './pages/student-dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent], // 2. Yaha add karein
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tutor_hub';
}