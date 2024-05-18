/*import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync()]
};*/
import { environment } from "./../environments/environment";

export const VERSION = '1.0.0';
export let PROFILE = 'Beta';
export const SERVER_API_URL = environment.urlBase;
