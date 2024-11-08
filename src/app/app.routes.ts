import { Routes } from "@angular/router";
import { SetupComponent } from "./pages/setup/setup.component";
import { NarratorComponent } from "./pages/narrator/narrator.component";
import { narratorGuard } from "./guards/narrator.guard";
import { SuccessComponent } from "./pages/spotify/success/success.component";
import { HomeComponent } from "./pages/home/home.component";
import { ConnectingComponent } from "./pages/spotify/connecting/connecting.component";

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "setup", component: SetupComponent },
    { path: "narrator", component: NarratorComponent, canActivate: [narratorGuard] },
    { path: "spotify", component: ConnectingComponent },
    { path: "spotify/success", component: SuccessComponent },
    { path: "**", pathMatch: "full", redirectTo: "/" }
];
