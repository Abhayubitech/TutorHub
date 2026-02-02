import { Component, OnInit, inject, signal, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../services/profile.service'; // Ensure path is correct
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-profile.component.html',
  styles: []
})
export class StudentProfileComponent implements OnInit {
  
  // Theme Signal (from Parent)
  isDarkModeInput = input<boolean>(false, { alias: 'isDarkMode' });
  activeTheme = signal<boolean>(false);

  // Profile Data Model
  profileData: any = {
    name: '',
    email: '',
    phone: '',
    qualifications: '',
    address: '',
    bio: ''
  };
  
  loading: boolean = false;
  isEditing: boolean = false; // Controls View vs Edit Mode

  private profileService = inject(ProfileService);
  private toastr = inject(ToastrService);

  constructor() {
    // Sync Theme
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') this.activeTheme.set(true);
    
    effect(() => {
      this.activeTheme.set(this.isDarkModeInput());
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    // 1. Load basic info from LocalStorage immediately (Fast Render)
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const user = JSON.parse(localUser);
      // Backend returns array usually, so access first item if it's an array
      const userData = Array.isArray(user) ? user[0] : user;
      this.profileData.name = userData.name || '';
      this.profileData.email = userData.email || '';
    }

    // 2. Fetch detailed info from Backend
    this.fetchProfile();
  }

  fetchProfile() {
    this.loading = true;
    this.profileService.getStudentProfile().subscribe({
      next: (res: any) => {
        // Merge API response with existing data (keeps name/email if API misses them)
        this.profileData = { ...this.profileData, ...res };
        this.loading = false;
        console.log('Profile Loaded:', this.profileData);
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.loading = false;
        // Optional: Toastr for error
      }
    });
  }

  toggleEdit() {
    if (this.isEditing) {
      this.saveProfile();
    } else {
      this.isEditing = true; // Switch to Edit Mode
    }
  }

  saveProfile() {
    this.loading = true;
    this.profileService.updateStudentProfile(this.profileData).subscribe({
      next: (res: any) => {
        this.toastr.success('Profile Updated Successfully');
        this.isEditing = false; // Switch back to View Mode
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to update profile');
        this.loading = false;
      }
    });
  }
}