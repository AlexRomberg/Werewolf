import { Routes } from '@angular/router';
import { SetupComponent } from './page/setup/setup.component';
import { NarratorComponent } from './pages/narrator/narrator.component';

export const routes: Routes = [
    { path: "", component: SetupComponent },
    { path: "narrator", component: NarratorComponent }
];
