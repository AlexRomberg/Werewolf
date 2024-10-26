import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient } from "@angular/common/http";
import { provideIcons } from "@ng-icons/core";
import { matLogOut, matPause, matPlayArrow, matSkipNext } from "@ng-icons/material-icons/baseline";

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideHttpClient(), provideIcons({ matLogOut, matPlayArrow, matPause, matSkipNext })]
};
