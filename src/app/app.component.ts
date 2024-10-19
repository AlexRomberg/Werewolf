import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NarratorComponent } from './pages/narrator/narrator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NarratorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'wolf';
}
