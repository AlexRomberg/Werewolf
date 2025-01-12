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
    })]
};
