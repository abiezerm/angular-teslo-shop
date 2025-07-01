import { provideRouter } from '@angular/router';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { loggingInterceptor } from '@shared/interceptors/logging.interceptor';
import { authInterceptor } from '@core/auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        //loggingInterceptor,
        authInterceptor,
      ])
    ),
  ]
};
