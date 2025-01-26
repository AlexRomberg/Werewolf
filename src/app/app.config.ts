import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient } from "@angular/common/http";
import { provideIcons } from "@ng-icons/core";
import {
    matDirectionsCar,
    matError,
    matLaptop,
    matLogOut,
    matPause,
    matPlayArrow,
    matRefresh,
    matSkipNext,
    matSmartphone,
    matSpeaker,
    matTablet,
    matTv,
} from "@ng-icons/material-icons/baseline";
import { LucideIconProvider, icons, LUCIDE_ICONS } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideHttpClient(), provideIcons({
        matDirectionsCar,
        matError,
        matLaptop,
        matLogOut,
        matPause,
        matPlayArrow,
        matRefresh,
        matSkipNext,
        matSmartphone,
        matSpeaker,
        matTablet,
        matTv,
    }), {
        provide: LUCIDE_ICONS,
        multi: true,
        useValue: new LucideIconProvider(icons)
    }]
};
