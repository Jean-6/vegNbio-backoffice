import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {MessageService} from 'primeng/api';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ToastModule} from 'primeng/toast';
import {provideAnimations} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {JwtInterceptor} from './_core/interceptors/jwt-interceptor';

registerLocaleData(localeFr, 'fr');


export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor,multi: true
    },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    MessageService,
    ToastModule,
    providePrimeNG({
      theme:{
        preset: Aura,
        options:{
          darkModeSelector: 'none'
        }
      }
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
