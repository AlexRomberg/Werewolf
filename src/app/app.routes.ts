import { Routes } from '@angular/router';
import { SetupComponent } from './page/setup/setup.component';
import { NarratorComponent } from './pages/narrator/narrator.component';
import { narratorGuard } from './guards/narrator.guard';

export const routes: Routes = [
    { path: "", component: SetupComponent },
    { path: "narrator", component: NarratorComponent, canActivate: [narratorGuard] }
];
