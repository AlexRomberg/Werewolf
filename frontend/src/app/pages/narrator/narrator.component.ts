import { Component, inject } from '@angular/core';
import { CircleComponent, PersonMove } from '../../components/circle/circle.component';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-narrator',
  imports: [CircleComponent],
  templateUrl: './narrator.component.html',
  styles: ``,
})
export class NarratorComponent {
  private game = inject(GameService);

  protected people = this.game.people.all;
  protected canStart = this.game.canStart;

  addPerson() {
    this.game.people.add();
  }

  removePerson(id: string) {
    this.game.people.remove(id);
  }

  movePerson(move: PersonMove) {
    this.game.people.move(move.id, move.toIndex);
  }
}
