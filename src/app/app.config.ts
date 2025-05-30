import { ApplicationConfig, isDevMode } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient } from "@angular/common/http";
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { icons } from "./util/icons";
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), {
    provide: LUCIDE_ICONS,
    multi: true,
    useValue: new LucideIconProvider(icons)
  }, provideAnimationsAsync(), provideServiceWorker('ngsw-worker.js', {
    enabled: !isDevMode(),
    registrationStrategy: 'registerWhenStable:30000'
  })]
};
