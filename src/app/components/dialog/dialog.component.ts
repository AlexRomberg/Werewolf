import { Component } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { CircleComponent } from '../circle/circle.component';
import { FormsModule } from '@angular/forms';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CircleComponent, FormsModule],
  templateUrl: './dialog.component.html'
})
export class DialogComponent {
  constructor(public dialog: DialogService, public gameState: GameStateService) { }
}
