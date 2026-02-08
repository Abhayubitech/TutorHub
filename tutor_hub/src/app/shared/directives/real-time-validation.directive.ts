import { Directive, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ValidationService } from '../../services/validation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appRealTimeValidation]',
  standalone: true
})
export class RealTimeValidationDirective implements OnInit, OnDestroy {
  @Input() fieldType: 'email' | 'name' | 'password' | 'phone' | 'message' | 'otp' | 'paymentAmount' | 'paymentDate' | 'upiId' = 'name';
  @Input() fieldName: string = '';
  @Input() debounceTime: number = 300; // milliseconds
  @Output() validationChange = new EventEmitter<{ isValid: boolean; errorMessage: string }>();
  @Output() isValid = new EventEmitter<boolean>();

  private destroy$ = new Subject<void>();
  private debounceTimer: any;

  constructor(private validationService: ValidationService) {}

  ngOnInit(): void {
    // Initial validation
    this.validateField('');
    
    // Subscribe to validation service for real-time updates
    this.validationService.validationResults$
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        if (results[this.fieldName]) {
          const fieldResult = results[this.fieldName];
          this.validationChange.emit({
            isValid: fieldResult.isValid,
            errorMessage: fieldResult.errorMessage
          });
          this.isValid.emit(fieldResult.isValid);
        }
      });
  }

  @HostListener('input')
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.validateWithDebounce(input.value);
  }

  @HostListener('blur')
  onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Validate immediately on blur (no debounce)
    this.validationService.validateField(this.fieldName, input.value, this.fieldType);
  }

  private validateWithDebounce(value: string): void {
    // Clear existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Set new timer
    this.debounceTimer = setTimeout(() => {
      this.validateField(value);
    }, this.debounceTime);
  }

  private validateField(value: string): void {
    this.validationService.validateField(this.fieldName, value, this.fieldType);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }
}
