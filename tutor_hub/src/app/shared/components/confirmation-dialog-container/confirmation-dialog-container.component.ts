import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../services/confirmation.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirmation-dialog-container',
  standalone: true,
  imports: [CommonModule, ConfirmationDialogComponent],
  templateUrl: './confirmation-dialog-container.component.html',
  styleUrl: './confirmation-dialog-container.component.css'
})
export class ConfirmationDialogContainerComponent implements OnInit, OnDestroy {
  isVisible = false;
  title = 'Confirm Action';
  message = 'Are you sure you want to proceed?';
  confirmText = 'Confirm';
  cancelText = 'Cancel';
  type: 'info' | 'warning' | 'danger' = 'info';
  
  private subscription: Subscription | null = null;

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.subscription = this.confirmationService.confirmation$.subscribe(options => {
      this.title = options.title || 'Confirm Action';
      this.message = options.message || 'Are you sure you want to proceed?';
      this.confirmText = options.confirmText || 'Confirm';
      this.cancelText = options.cancelText || 'Cancel';
      this.type = options.type || 'info';
      this.isVisible = true;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onConfirm(): void {
    this.confirmationService.respond(true);
    this.isVisible = false;
  }

  onCancel(): void {
    this.confirmationService.respond(false);
    this.isVisible = false;
  }
}
