# SweetAlert2 Implementation Guide

This document shows how to use SweetAlert2 in your TutorHub application.

## Installation
SweetAlert2 is already installed in your project:
```bash
npm install sweetalert2
```

## Basic Usage Examples

### 1. Using the SweetAlertService (Recommended)

Import the service in your component:
```typescript
import { SweetAlertService } from '../../../services/sweetalert.service';

constructor(private sweetAlert: SweetAlertService) { }
```

#### Success Message
```typescript
this.sweetAlert.showSuccess('Success!', 'Operation completed successfully');
```

#### Error Message
```typescript
this.sweetAlert.showError('Error!', 'Something went wrong');
```

#### Confirmation Dialog
```typescript
const confirmed = await this.sweetAlert.confirmDelete('this user');
if (confirmed) {
  // Proceed with deletion
}
```

#### Logout Confirmation
```typescript
const confirmed = await this.sweetAlert.confirmLogout();
if (confirmed) {
  this.authService.logout();
}
```

#### Toast Notification
```typescript
this.sweetAlert.showToast('Item saved successfully!', 'success');
```

### 2. Direct SweetAlert2 Usage

Import SweetAlert2 directly:
```typescript
import Swal from 'sweetalert2';
```

#### Basic Confirmation
```typescript
const result = await Swal.fire({
  title: 'Are you sure?',
  text: 'Do you want to proceed?',
  icon: 'question',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, proceed!',
  cancelButtonText: 'Cancel'
});

if (result.isConfirmed) {
  // User confirmed
}
```

#### Success Message
```typescript
Swal.fire('Success!', 'Operation completed!', 'success');
```

#### Warning with Confirmation
```typescript
const result = await Swal.fire({
  title: 'Delete Item?',
  text: 'This action cannot be undone!',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#d33',
  cancelButtonColor: '#3085d6',
  confirmButtonText: 'Yes, delete!'
});
```

## Current Implementation

### Student Dashboard
- **cancelRequest()**: Shows confirmation before canceling enrollment requests
- **logout()**: Shows confirmation before logging out

### Admin Dashboard  
- **deleteUser()**: Shows confirmation before deleting users
- **logout()**: Shows confirmation before logging out

### Teacher Dashboard
- **deleteCourse()**: Shows confirmation before deleting courses
- **removeStudent()**: Shows confirmation before removing students
- **logout()**: Shows confirmation before logging out

## SweetAlert Service Methods

| Method | Purpose | Example |
|--------|---------|---------|
| `showSuccess(title, text?)` | Success message | `showSuccess('Saved!', 'Changes saved')` |
| `showError(title, text?)` | Error message | `showError('Error!', 'Failed to save')` |
| `showWarning(title, text?)` | Warning message | `showWarning('Warning!', 'Check your input')` |
| `showInfo(title, text?)` | Info message | `showInfo('Info', 'Processing...')` |
| `confirm(title, text?, ...)` | Custom confirmation | `confirm('Proceed?', 'Continue?')` |
| `confirmDelete(itemName?)` | Delete confirmation | `confirmDelete('this user')` |
| `confirmLogout()` | Logout confirmation | `confirmLogout()` |
| `confirmCancel(action?)` | Cancel confirmation | `confirmCancel('this request')` |
| `confirmRemove(itemName?)` | Remove confirmation | `confirmRemove('this student')` |
| `showLoading(title?)` | Show loading | `showLoading('Saving...')` |
| `closeLoading()` | Close loading | `closeLoading()` |
| `showToast(title, icon?, ...)` | Toast notification | `showToast('Saved!', 'success')` |
| `custom(options)` | Custom configuration | `custom({title: 'Custom'})` |

## Best Practices

1. **Use the service** for consistent styling and behavior
2. **Always await** confirmation dialogs
3. **Provide clear messages** that explain the action
4. **Use appropriate icons** (warning for destructive actions, question for confirmations)
5. **Show success feedback** after actions complete
6. **Use toast notifications** for non-critical updates

## Migration from Native Alerts

Replace:
```typescript
if (confirm('Are you sure?')) {
  // action
}
```

With:
```typescript
const confirmed = await this.sweetAlert.confirm('Are you sure?', 'Do you want to proceed?');
if (confirmed) {
  // action
}
```

Replace:
```typescript
alert('Success!');
```

With:
```typescript
this.sweetAlert.showSuccess('Success!');
```
