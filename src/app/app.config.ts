import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient } from "@angular/common/http";
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { icons } from "./util/icons";

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideHttpClient(), {
        provide: LUCIDE_ICONS,
        multi: true,
        useValue: new LucideIconProvider(icons)
    }, provideAnimationsAsync()]
};
