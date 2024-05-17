import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient} from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {TokenInterceptor} from "./interceptors/tokenInterceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
};
