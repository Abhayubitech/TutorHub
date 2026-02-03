import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ProfileData {
  name: string;
  phone: string | null;
}

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css'
})
export class ProfileFormComponent {
  @Input() userName: string = '';
  @Input() userEmail: string = '';
  @Input() userPhone: string | null = null;
  @Input() isLoading: boolean = false;
  @Input() submitButtonText: string = 'Save Changes';
  @Input() cancelButtonText: string = 'Cancel';
  @Output() submit = new EventEmitter<ProfileData>();
  @Output() cancel = new EventEmitter<void>();

  editingName: string = '';
  editingPhone: string = '';
  validationErrors: string[] = [];

  ngOnInit() {
    this.editingName = this.userName;
    this.editingPhone = this.userPhone || '';
  }

  validateForm(): boolean {
    this.validationErrors = [];
    
    // Name validation
    const nameRegex = /^[a-zA-Z\s'-]*$/;
    if (!nameRegex.test(this.editingName.trim())) {
      this.validationErrors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
    }
    
    if (this.editingName.trim().length > 33) {
      this.validationErrors.push('Name must be maximum 33 characters');
    }
    
    if (this.editingName.trim().length < 2) {
      this.validationErrors.push('Name must be at least 2 characters');
    }
    
    // Phone validation (optional)
    if (this.editingPhone.trim()) {
      const phoneRegex = /^[\d+\-\s()]*$/;
      if (!phoneRegex.test(this.editingPhone.trim())) {
        this.validationErrors.push('Phone can only contain numbers, spaces, hyphens, and parentheses');
      }
      
      if (this.editingPhone.trim().length > 20) {
        this.validationErrors.push('Phone must be maximum 20 characters');
      }
    }
    
    return this.validationErrors.length === 0;
  }

  onSubmit(): void {
    if (this.validateForm()) {
      const profileData: ProfileData = {
        name: this.editingName.trim(),
        phone: this.editingPhone.trim() || null
      };
      this.submit.emit(profileData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onNameInput(): void {
    // Clear name-related errors when user types
    this.validationErrors = this.validationErrors.filter(error => 
      !error.includes('Name')
    );
  }

  onPhoneInput(): void {
    // Clear phone-related errors when user types
    this.validationErrors = this.validationErrors.filter(error => 
      !error.includes('Phone')
    );
  }
}
