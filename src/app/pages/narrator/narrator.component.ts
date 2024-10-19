import { Component } from '@angular/core';
import { CircleComponent } from "../../components/circle/circle.component";
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-narrator',
  standalone: true,
  imports: [CircleComponent],
  templateUrl: './narrator.component.html',
  styleUrl: './narrator.component.css'
})
export class NarratorComponent {
  constructor(public state: GameStateService) {
    state.StartGame();
  }
}
