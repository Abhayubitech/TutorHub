import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationService, ValidationResult } from '../../../services/validation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-validation-feedback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="validation-feedback" [class]="{ 'has-error': !isValid, 'is-valid': isValid && showError }">
      @if (!isValid && errorMessage) {
        <div class="error-container">
          <span class="error-icon">⚠️</span>
          <span class="error-message">{{ errorMessage }}</span>
        </div>
      }
      
      @if (isValid && showError) {
        <div class="success-container">
          <span class="success-icon">✓</span>
          <span class="success-message">Looks good!</span>
        </div>
      }
    </div>
  `,
  styleUrls: ['./validation-feedback.component.css']
})
export class ValidationFeedbackComponent implements OnInit, OnChanges, OnDestroy {
  @Input() fieldName: string = '';
  @Input() showError: boolean = false; // Show success state
  @Input() customError: string = ''; // Override error message

  private destroy$ = new Subject<void>();
  isValid: boolean = true;
  errorMessage: string = '';

  constructor(private validationService: ValidationService) {}

  ngOnInit(): void {
  
    
    this.validationService.validationResults$
      .pipe(takeUntil(this.destroy$))
      .subscribe((results: ValidationResult) => {
        const fieldResult = results[this.fieldName];
        if (fieldResult) {
          this.isValid = fieldResult.isValid;
          this.errorMessage = this.customError || fieldResult.errorMessage;
        } else {
          this.isValid = true;
          this.errorMessage = '';
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle input changes if needed
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
