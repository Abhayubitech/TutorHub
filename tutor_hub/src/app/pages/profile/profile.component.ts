import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { SweetToastService } from '../../services/sweet-toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileService = inject(ProfileService);
  router = inject(Router);
  toast = inject(SweetToastService);

  user: any = null;
  selectedFile: File | null = null;
  
  imagePreview = signal<string | null>(null);

  formData: any = {
    name: '', email: '', phone: '', address: '', 
    school_name: '', grade: '',                  
    bio: '', qualifications: '', experience: ''  
  };

  ngOnInit() {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
      this.fetchProfile();
    } else {
      this.router.navigate(['/login']);
    }
  }

  fetchProfile() {
    this.profileService.getProfileData(this.user.role, this.user.id).subscribe({
      next: (res: any) => {
        if (res.profile_pic) {
          this.user.profile_pic = res.profile_pic;
        }

        this.formData = { 
            name: res.name || '',
            email: res.email || '',
            phone: res.phone || '',
            address: res.address || '',
            school_name: res.school_name || '',
            grade: res.grade || '',
            bio: res.bio || '',
            qualifications: res.qualifications || '',
            experience: res.experience || ''
        };
      },
      error: (err) => console.log("Profile error", err)
    });
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string); 
      };
      reader.readAsDataURL(this.selectedFile as Blob);
    }
  }

  goBack() {
    if(this.user.role === 'admin') {
        this.router.navigate(['/admin-dashboard']);
    } else {
        this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    const dataToSend = new FormData();
    dataToSend.append('user_id', this.user.id);
    dataToSend.append('name', this.formData.name);
    dataToSend.append('email', this.formData.email);
    dataToSend.append('phone', this.formData.phone);
    dataToSend.append('address', this.formData.address);

    if (this.user.role === 'student') {
        dataToSend.append('school_name', this.formData.school_name);
        dataToSend.append('grade', this.formData.grade);
    } else if (this.user.role === 'teacher') {
        dataToSend.append('bio', this.formData.bio);
        dataToSend.append('qualifications', this.formData.qualifications);
        dataToSend.append('experience', this.formData.experience);
    }

    if (this.selectedFile) {
      dataToSend.append('profile_pic', this.selectedFile);
    }

    this.profileService.updateProfile(this.user.role, dataToSend).subscribe({
      next: () => {
        this.toast.success("Profile Updated Successfully! ✅");
        
        const updatedUser = { ...this.user, name: this.formData.name, email: this.formData.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        this.profileService.profileUpdated$.next(); 
        this.goBack();
      },
      error: (err) => {
         console.error(err);
         this.toast.error("Update Failed! ❌");
      }
    });
  }
}