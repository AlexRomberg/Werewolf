import { Component, inject } from '@angular/core';
import { CircleComponent } from '../../components/circle/circle.component';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-narrator',
  imports: [CircleComponent],
  templateUrl: './narrator.component.html',
  styles: ``,
})
export class NarratorComponent {
  private game = inject(GameService);

  protected people = this.game.people;
  protected canStart = this.game.canStart;

  addPerson() {
    this.game.addPerson();
  }

  removePerson(id: string) {
    this.game.removePerson(id);
  }
}
