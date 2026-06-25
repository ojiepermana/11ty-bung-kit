import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideUiTheme } from '@ojiepermana/angular/theme/styles';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    // @ojiepermana/angular design-system theme (light, base season).
    provideUiTheme({ mode: 'light', season: 'base' }),
  ],
};
