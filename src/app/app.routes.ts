import { Routes } from "@angular/router";
import { SetupComponent } from "./pages/setup/setup.component";
import { NarratorComponent } from "./pages/narrator/narrator.component";
import { narratorGuard } from "./guards/narrator.guard";
import { SpotifyComponent } from "./pages/spotify/spotify.component";
import { SuccessComponent } from "./pages/spotify/success/success.component";

export const routes: Routes = [
    { path: "", component: SetupComponent },
    { path: "narrator", component: NarratorComponent, canActivate: [narratorGuard] },
    { path: "spotify", component: SpotifyComponent },
    { path: "spotify/success", component: SuccessComponent },
    { path: "**", pathMatch: "full", redirectTo: "/" }
];
