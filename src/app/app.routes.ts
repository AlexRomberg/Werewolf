import { Routes } from "@angular/router";
import { narratorGuard } from "./guards/narrator.guard";

export const routes: Routes = [
    { path: "", loadComponent: () => import("./pages/home/home.component").then(m => m.HomeComponent) },
    { path: "setup", loadComponent: () => import("./pages/setup/setup.component").then(m => m.SetupComponent) },
    { path: "cards", loadComponent: () => import("./pages/cards/cards.component").then(m => m.CardsComponent) },
    { path: "narrator", loadComponent: () => import("./pages/narrator/narrator.component").then(m => m.NarratorComponent), canActivate: [narratorGuard] },
    { path: "spotify", loadComponent: () => import("./pages/spotify/connecting/connecting.component").then(m => m.ConnectingComponent) },
    { path: "spotify/success", loadComponent: () => import("./pages/spotify/success/success.component").then(m => m.SuccessComponent) },
    { path: "**", pathMatch: "full", redirectTo: "/" }
];
