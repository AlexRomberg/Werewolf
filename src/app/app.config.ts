import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient } from "@angular/common/http";
import { LucideIconProvider, icons, LUCIDE_ICONS } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideHttpClient(), {
        provide: LUCIDE_ICONS,
        multi: true,
        useValue: new LucideIconProvider(icons)
    }]
};
