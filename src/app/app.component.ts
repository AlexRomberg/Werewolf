import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NarratorComponent } from './pages/narrator/narrator.component';
import { DialogComponent } from "./components/dialog/dialog.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NarratorComponent, DialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'wolf';
}
