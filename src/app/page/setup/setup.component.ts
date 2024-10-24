import { Component } from '@angular/core';
import { Thief } from '../../models/roles/thief';
import { Cupit } from '../../models/roles/cupit';
import { WildChild } from '../../models/roles/wolvechild';
import { Seer } from '../../models/roles/seer';
import { Werewolf } from '../../models/roles/welewolf';
import { Witch } from '../../models/roles/witch';
import { FormsModule } from '@angular/forms';
import { GameStateService } from '../../services/game-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css'
})
export class SetupComponent {
  public Roles = {
    Common: [
      // One time characters ----------
      { instance: new Thief(), selected: false },
      { instance: new Cupit(), selected: false },
      { instance: new WildChild(), selected: false },
      // Repeating characters ----------
      { instance: new Seer(), selected: false },
      { instance: new Werewolf(), selected: false },
      { instance: new Witch(), selected: false }
    ]
  }

  public PeopleCount = 1;

  constructor(private state: GameStateService, private router: Router) { }

  public StartGame() {
    this.state.Characters = this.Roles.Common.filter(r => r.selected).map(r => r.instance);
    this.state.Connections = [];
    this.state.People = this.state.People.slice(0, this.PeopleCount);
    for (let i = 0; i < this.PeopleCount; i++) {
      const person = this.state.People[i];
      this.state.People[i] = { role: undefined, victim: false, protected: false, id: i, name: person?.name ?? "" };
    }
    this.router.navigateByUrl('/narrator');
  }
}
