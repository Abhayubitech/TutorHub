import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CourseCreateComponent } from './components/course-create/course-create.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

const authGuard = () => {
    const authService = inject(AuthService);
    return authService.isAuthenticated() || false;
};

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [() => inject(AuthService).isAuthenticated()] },
    { path: 'courses', component: CourseListComponent, canActivate: [() => inject(AuthService).isAuthenticated()] },
    { path: 'create-course', component: CourseCreateComponent, canActivate: [() => inject(AuthService).isAuthenticated()] }
];
