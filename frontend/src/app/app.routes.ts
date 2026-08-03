import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: "", loadComponent: () => import("./pages/home/home.component").then(m => m.HomeComponent) },
    { path: "narrator", loadComponent: () => import("./pages/narrator/narrator.component").then(m => m.NarratorComponent) },
    { path: "cards", loadComponent: () => import("./pages/cards/cards.component").then(m => m.CardsComponent) },
    { path: "join", loadComponent: () => import("./pages/join/join.component").then(m => m.JoinComponent) },
    { path: "room/:code", loadComponent: () => import("./pages/room/room.component").then(m => m.RoomComponent) },
    { path: "**", redirectTo: "/", pathMatch: "full" }
];
