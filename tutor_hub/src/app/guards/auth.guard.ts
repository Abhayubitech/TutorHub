import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // ✅ Check karein ki user logged in hai ya nahi
  const user = localStorage.getItem('user');

  if (user) {
    return true; // ✅ Access Granted
  } else {
    router.navigate(['/login']); // ❌ Access Denied -> Redirect to Login
    return false;
  }
};