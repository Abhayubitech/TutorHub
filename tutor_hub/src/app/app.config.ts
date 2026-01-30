import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; // Required
import { provideToastr } from 'ngx-toastr'; // Required

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(), // Animations enable karein
    provideToastr({      // Toastr config
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }) 
  ]
};