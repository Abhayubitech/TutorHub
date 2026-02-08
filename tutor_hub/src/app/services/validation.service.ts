import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ValidationRule {
  field: string;
  value: string;
  isValid: boolean;
  errorMessage: string;
  timestamp: number;
}

export interface ValidationResult {
  [key: string]: {
    isValid: boolean;
    errorMessage: string;
    timestamp: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private validationResults = signal<ValidationResult>({});
  private validationRules = signal<ValidationRule[]>([]);
  
  // Validation result stream for components to subscribe to
  public validationResults$ = new BehaviorSubject<ValidationResult>({});

  constructor() {
    // Clear old validations on page load
    this.clearValidations();
  }

  // Email validation
  validateEmail(email: string): { isValid: boolean; errorMessage: string } {
    if (!email || email.trim() === '') {
      return { isValid: false, errorMessage: 'Email is required' };
    }

    if (email.length > 33) {
      return { isValid: false, errorMessage: 'Email must be 33 characters or less' };
    }

    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      return { isValid: false, errorMessage: 'Please enter a valid email address' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, errorMessage: 'Please enter a valid email address' };
    }

    return { isValid: true, errorMessage: '' };
  }

  // Name validation
  validateName(name: string): { isValid: boolean; errorMessage: string } {
    if (!name || name.trim() === '') {
      return { isValid: false, errorMessage: 'Name is required' };
    }

    if (name.length > 33) {
      return { isValid: false, errorMessage: 'Name must be 33 characters or less' };
    }

    if (name.trim().length < 2) {
      return { isValid: false, errorMessage: 'Name must be at least 2 characters' };
    }

    const nameRegex = /^[a-zA-Z\s'-]*$/;
    if (!nameRegex.test(name)) {
      return { isValid: false, errorMessage: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }

    return { isValid: true, errorMessage: '' };
  }

  // Password validation
  validatePassword(password: string): { isValid: boolean; errorMessage: string } {
    if (!password || password.trim() === '') {
      return { isValid: false, errorMessage: 'Password is required' };
    }

    if (password.length > 11) {
      return { isValid: false, errorMessage: 'Password must be 11 characters or less' };
    }

    if (password.length < 6) {
      return { isValid: false, errorMessage: 'Password must be at least 6 characters long' };
    }

    return { isValid: true, errorMessage: '' };
  }

  // Phone validation
  validatePhone(phone: string): { isValid: boolean; errorMessage: string } {
    if (!phone || phone.trim() === '') {
      return { isValid: true, errorMessage: '' }; // Phone is optional
    }

    if (phone.length > 20) {
      return { isValid: false, errorMessage: 'Phone must be 20 characters or less' };
    }

    const phoneRegex = /^[\d+\-\s()]*$/;
    if (!phoneRegex.test(phone)) {
      return { isValid: false, errorMessage: 'Phone can only contain numbers, +, -, spaces, and parentheses' };
    }

    return { isValid: true, errorMessage: '' };
  }

  // Message validation
  validateMessage(message: string): { isValid: boolean; errorMessage: string } {
    if (!message || message.trim() === '') {
      return { isValid: false, errorMessage: 'Message is required' };
    }

    if (message.length > 1000) {
      return { isValid: false, errorMessage: 'Message must be 1000 characters or less' };
    }

    if (message.trim().length < 10) {
      return { isValid: false, errorMessage: 'Message must be at least 10 characters' };
    }

    return { isValid: true, errorMessage: '' };
  }

  // OTP validation
  validateOTP(otp: string): { isValid: boolean; errorMessage: string } {
    if (!otp || otp.trim() === '') {
      return { isValid: false, errorMessage: 'OTP is required' };
    }

    if (otp.length !== 6) {
      return { isValid: false, errorMessage: 'OTP must be exactly 6 digits' };
    }

    const otpRegex = /^[0-9]{6}$/;
    if (!otpRegex.test(otp)) {
      return { isValid: false, errorMessage: 'OTP must contain only numbers' };
    }

    return { isValid: true, errorMessage: '' };
  }

  // Payment amount validation
  validatePaymentAmount(amount: number | null): { isValid: boolean; errorMessage: string } {
    if (amount === null || amount === undefined) {
      return { isValid: false, errorMessage: 'Payment amount is required' };
    }

    if (amount <= 0) {
      return { isValid: false, errorMessage: 'Payment amount must be greater than 0' };
    }

    if (amount > 999999) {
      return { isValid: false, errorMessage: 'Payment amount seems too high' };
    }

    return { isValid: true, errorMessage: '' };
  }

  // Payment date validation
  validatePaymentDate(date: string): { isValid: boolean; errorMessage: string } {
    if (!date || date.trim() === '') {
      return { isValid: false, errorMessage: 'Payment date is required' };
    }

    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      return { isValid: false, errorMessage: 'Payment date cannot be in the future' };
    }

    // Check if date is too old (more than 1 year)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    if (inputDate < oneYearAgo) {
      return { isValid: false, errorMessage: 'Payment date cannot be more than 1 year old' };
    }

    return { isValid: true, errorMessage: '' };
  }

  // UPI Transaction ID validation
  validateUPIId(upiId: string): { isValid: boolean; errorMessage: string } {
    if (!upiId || upiId.trim() === '') {
      return { isValid: true, errorMessage: '' }; // UPI ID is optional
    }

    if (upiId.length > 50) {
      return { isValid: false, errorMessage: 'UPI Transaction ID must be 50 characters or less' };
    }

    const upiRegex = /^[a-zA-Z0-9@.-]{6,50}$/;
    if (!upiRegex.test(upiId)) {
      return { isValid: false, errorMessage: 'UPI Transaction ID can only contain letters, numbers, @, ., and -' };
    }

    return { isValid: true, errorMessage: '' };
  }

  // Real-time validation method
  validateField(fieldName: string, value: string, fieldType: 'email' | 'name' | 'password' | 'phone' | 'message' | 'otp' | 'paymentAmount' | 'paymentDate' | 'upiId'): void {
    const timestamp = Date.now();
    let result: { isValid: boolean; errorMessage: string };

    switch (fieldType) {
      case 'email':
        result = this.validateEmail(value);
        break;
      case 'name':
        result = this.validateName(value);
        break;
      case 'password':
        result = this.validatePassword(value);
        break;
      case 'phone':
        result = this.validatePhone(value);
        break;
      case 'message':
        result = this.validateMessage(value);
        break;
      case 'otp':
        result = this.validateOTP(value);
        break;
      case 'paymentAmount':
        result = this.validatePaymentAmount(Number(value));
        break;
      case 'paymentDate':
        result = this.validatePaymentDate(value);
        break;
      case 'upiId':
        result = this.validateUPIId(value);
        break;
      default:
        result = { isValid: true, errorMessage: '' };
    }

    // Update validation results
    const currentResults = this.validationResults();
    currentResults[fieldName] = {
      isValid: result.isValid,
      errorMessage: result.errorMessage,
      timestamp
    };

    this.validationResults.set(currentResults);
    this.validationResults$.next(currentResults);

    // Update validation rules list
    const currentRules = this.validationRules();
    const existingRuleIndex = currentRules.findIndex(rule => rule.field === fieldName);
    
    const newRule: ValidationRule = {
      field: fieldName,
      value,
      isValid: result.isValid,
      errorMessage: result.errorMessage,
      timestamp
    };

    if (existingRuleIndex >= 0) {
      currentRules[existingRuleIndex] = newRule;
    } else {
      currentRules.push(newRule);
    }

    this.validationRules.set(currentRules);
  }

  // Get validation result for a specific field
  getFieldValidation(fieldName: string): { isValid: boolean; errorMessage: string } {
    const results = this.validationResults();
    const fieldResult = results[fieldName];
    
    if (!fieldResult) {
      return { isValid: true, errorMessage: '' };
    }

    return {
      isValid: fieldResult.isValid,
      errorMessage: fieldResult.errorMessage
    };
  }

  // Check if entire form is valid
  isFormValid(fieldNames: string[]): boolean {
    const results = this.validationResults();
    return fieldNames.every(fieldName => {
      const fieldResult = results[fieldName];
      return fieldResult && fieldResult.isValid;
    });
  }

  // Clear validation for a specific field
  clearFieldValidation(fieldName: string): void {
    const currentResults = this.validationResults();
    delete currentResults[fieldName];
    this.validationResults.set(currentResults);
    this.validationResults$.next(currentResults);

    // Remove from validation rules
    const currentRules = this.validationRules();
    const filteredRules = currentRules.filter(rule => rule.field !== fieldName);
    this.validationRules.set(filteredRules);
  }

  // Clear all validations
  clearValidations(): void {
    this.validationResults.set({});
    this.validationRules.set([]);
    this.validationResults$.next({});
  }

  // Get all validation results
  getAllValidationResults(): ValidationResult {
    return this.validationResults();
  }

  // Get validation rules (for debugging)
  getValidationRules(): ValidationRule[] {
    return this.validationRules();
  }
}
