import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  // Styles yahi define kar diye hain (No External File needed)
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-enter {
      animation: fadeInUp 0.6s ease-out forwards;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // console.log(this.loginForm.value);

      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          console.log(res[0].name);

          this.toastr.success('Welcome back to TutorHub!', 'Login Successful');

          // Token Save Logic
          localStorage.setItem('token', JSON.stringify(res[0].id));
          localStorage.setItem('role', JSON.stringify(res[0].role));
          localStorage.setItem('user', JSON.stringify(res));
          if (res[0].role == 'teacher') {
             this.loginForm.reset();
            setTimeout(() => {
              this.router.navigate(['/teacher-dashboard']); // Dashboard ya Home par redirect
            }, 500);

          
          } else if(res[0].role == 'student'){
              this.loginForm.reset();
            setTimeout(() => {
              this.router.navigate(['/student-dashboard']); // Dashboard ya Home par redirect
            }, 500);
          }
        },
        error: (err) => {
          this.toastr.error(err.error.message || 'Invalid credentials', 'Login Failed');
        }
      });
    } else {
      this.toastr.warning('Please enter valid email and password', 'Check Fields');
      this.loginForm.markAllAsTouched(); // Errors highlight karega
    }
  }
}