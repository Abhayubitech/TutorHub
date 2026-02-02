import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';

export const routes: Routes = [
  // Default Route: Agar koi sirf website khole, toh Login par bhej do
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Login Route
  { path: 'login', component: LoginComponent },
  
  // Signup Route
  { path: 'signup', component: SignupComponent },

  { path: 'student-dashboard', component: StudentDashboardComponent },

  { path: 'teacher-dashboard', component: TeacherDashboardComponent },

  // Wildcard Route: Agar koi galat URL dale (e.g. /abcd), toh Login par bhej do
  { path: '**', redirectTo: 'login' },

];