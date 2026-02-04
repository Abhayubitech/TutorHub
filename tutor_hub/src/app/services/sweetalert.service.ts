import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  // Default configuration for consistent styling
  private getDefaultConfig() {
    return {
      backdrop: 'rgba(0, 0, 0, 0.5)',
      background: '#ffffff',
      customClass: {
        popup: 'custom-swal-popup',
        header: 'custom-swal-header',
        title: 'custom-swal-title',
        content: 'custom-swal-content',
        actions: 'custom-swal-actions',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel',
        closeButton: 'custom-swal-close'
      },
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    };
  }

  // Success alert
  showSuccess(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.getDefaultConfig(),
      title,
      text,
      icon: 'success',
      iconHtml: '<div class="success-icon">✓</div>',
      confirmButtonText: 'Great!',
      confirmButtonColor: '#10b981',
      timer: 3000,
      timerProgressBar: true,
      didOpen: (popup) => {
        popup.classList.add('success-modal');
      }
    });
  }

  // Error alert
  showError(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.getDefaultConfig(),
      title,
      text,
      icon: 'error',
      iconHtml: '<div class="error-icon">✕</div>',
      confirmButtonText: 'OK',
      confirmButtonColor: '#ef4444',
      didOpen: (popup) => {
        popup.classList.add('error-modal');
      }
    });
  }

  // Warning alert
  showWarning(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.getDefaultConfig(),
      title,
      text,
      icon: 'warning',
      iconHtml: '<div class="warning-icon">!</div>',
      confirmButtonText: 'I Understand',
      confirmButtonColor: '#f59e0b',
      didOpen: (popup) => {
        popup.classList.add('warning-modal');
      }
    });
  }

  // Info alert
  showInfo(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.getDefaultConfig(),
      title,
      text,
      icon: 'info',
      iconHtml: '<div class="info-icon">i</div>',
      confirmButtonText: 'Got it',
      confirmButtonColor: '#3b82f6',
      didOpen: (popup) => {
        popup.classList.add('info-modal');
      }
    });
  }

  // Confirmation dialog
  async confirm(
    title: string,
    text?: string,
    confirmText: string = 'Yes',
    cancelText: string = 'Cancel',
    icon: SweetAlertIcon = 'question'
  ): Promise<boolean> {
    const result = await Swal.fire({
      ...this.getDefaultConfig(),
      title,
      text,
      icon,
      iconHtml: icon === 'question' ? '<div class="question-icon">?</div>' : undefined,
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
      didOpen: (popup) => {
        popup.classList.add('confirm-modal');
      }
    });
    return result.isConfirmed;
  }

  // Delete confirmation
  async confirmDelete(itemName: string = 'this item'): Promise<boolean> {
    return this.confirm(
      'Delete?',
      `Are you sure you want to delete ${itemName}? This action cannot be undone!`,
      'Yes, delete!',
      'Cancel',
      'warning'
    );
  }

  // Logout confirmation
  async confirmLogout(): Promise<boolean> {
    const result = await Swal.fire({
      ...this.getDefaultConfig(),
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      iconHtml: '<div class="logout-icon">👋</div>',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      didOpen: (popup) => {
        popup.classList.add('logout-modal');
      }
    });
    return result.isConfirmed;
  }

  // Cancel confirmation
  async confirmCancel(action: string = 'this action'): Promise<boolean> {
    return this.confirm(
      'Cancel?',
      `Are you sure you want to cancel ${action}?`,
      'Yes, cancel it!',
      'No, keep it',
      'warning'
    );
  }

  // Remove confirmation
  async confirmRemove(itemName: string = 'this item'): Promise<boolean> {
    return this.confirm(
      'Remove?',
      `Are you sure you want to remove ${itemName}?`,
      'Yes, remove!',
      'Cancel',
      'warning'
    );
  }

  // Loading dialog
  showLoading(title: string = 'Loading...'): void {
    Swal.fire({
      ...this.getDefaultConfig(),
      title,
      html: `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">${title}</div>
        </div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  // Close loading dialog
  closeLoading(): void {
    Swal.close();
  }

  // Toast notification
  showToast(
    title: string,
    icon: SweetAlertIcon = 'success',
    position: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end' = 'top-end',
    timer: number = 3000
  ): void {
    const iconHtml = {
      success: '<div class="toast-success">✓</div>',
      error: '<div class="toast-error">✕</div>',
      warning: '<div class="toast-warning">!</div>',
      info: '<div class="toast-info">i</div>',
      question: '<div class="toast-question">?</div>'
    }[icon] || '';

    Swal.fire({
      title: '',
      html: `
        <div class="toast-content">
          <div class="toast-icon">${iconHtml}</div>
          <div class="toast-message">${title}</div>
        </div>
      `,
      toast: true,
      position,
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
      background: '#ffffff',
      customClass: {
        popup: 'custom-toast',
        title: 'custom-toast-title'
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
  }

  // Custom alert
  custom(options: any): Promise<SweetAlertResult> {
    return Swal.fire(options);
  }
}
