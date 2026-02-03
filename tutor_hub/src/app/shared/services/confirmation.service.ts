import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmationOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private confirmationSubject = new Subject<ConfirmationOptions & { id: string }>();
  private responseSubject = new Subject<{ id: string; confirmed: boolean }>();
  
  public confirmation$ = this.confirmationSubject.asObservable();
  public response$ = this.responseSubject.asObservable();
  
  private currentId = '';

  confirm(options: ConfirmationOptions = {}): Promise<boolean> {
    return new Promise((resolve) => {
      this.currentId = Math.random().toString(36).substr(2, 9);
      
      const defaultOptions: ConfirmationOptions = {
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'info',
        ...options
      };
      
      this.confirmationSubject.next({ ...defaultOptions, id: this.currentId });
      
      // Listen for response
      const subscription = this.response$.subscribe(({ id, confirmed }) => {
        if (id === this.currentId) {
          subscription.unsubscribe();
          resolve(confirmed);
        }
      });
    });
  }
  
  respond(confirmed: boolean): void {
    if (this.currentId) {
      this.responseSubject.next({ id: this.currentId, confirmed });
    }
  }
}
