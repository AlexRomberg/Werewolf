import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: "", loadComponent: () => import("./pages/home/home.component").then(m => m.HomeComponent) },
    { path: "play", loadComponent: () => import("./pages/play/play.component").then(m => m.PlayComponent) },
    { path: "characters", loadComponent: () => import("./pages/characters/characters.component").then(m => m.CharactersComponent) },
    { path: "room/:id", loadComponent: () => import("./pages/room/room.component").then(m => m.RoomComponent) },
    { path: "join", loadComponent: () => import("./pages/join/join.component").then(m => m.JoinComponent) },
    { path: "**", redirectTo: "/", pathMatch: "full" }
];
