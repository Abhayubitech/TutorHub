import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetToastService {

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end', 
    showConfirmButton: false,
    timer: 3000, 
    timerProgressBar: true,
    didOpen: (toast) => {
      const container = Swal.getContainer();
      if (container) {
        container.style.top = '75px';
      }
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  success(message: string) {
    this.Toast.fire({
      icon: 'success',
      title: message
    });
  }

  error(message: string) {
    this.Toast.fire({
      icon: 'error',
      title: message
    });
  }

  warning(message: string) {
    this.Toast.fire({
      icon: 'warning',
      title: message
    });
  }

  async confirm(title: string, text: string, confirmBtnText: string = 'Yes', btnColor: string = '#3085d6'): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: btnColor,
      cancelButtonColor: '#6c757d', 
      confirmButtonText: confirmBtnText
    });
    
    return result.isConfirmed; 
  }
}