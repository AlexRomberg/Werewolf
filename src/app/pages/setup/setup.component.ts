import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameStateService } from '../../services/game-state.service';
import { Router } from '@angular/router';
import { GroupedRoles } from '../../models/roles/roles';
import { CardComponent } from '../../components/setup/card/card.component';
import { RoleGroup } from '../../types';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [FormsModule, CardComponent],
  templateUrl: './setup.component.html'
})
export class SetupComponent {
  public Roles: RoleGroup[] = GroupedRoles;
  public PeopleCount = 1;

  constructor(private state: GameStateService, private router: Router) { }

  public StartGame() {
    this.state.Characters = this.Roles
      .map(r => r.cards)
      .flat()
      .filter(r => r.selected)
      .sort((ra, rb) => (ra.role.Priority ?? -1) - (rb.role.Priority ?? -1))
      .map(r => r.role);
    this.state.People = this.state.People.slice(0, this.PeopleCount);
    for (let i = 0; i < this.PeopleCount; i++) {
      const person = this.state.People[i];
      this.state.People[i] = { role: undefined, victim: false, protected: false, dead: false, id: i, name: person?.name ?? "" };
    }

    this.state.StartGame();
    this.router.navigateByUrl('/narrator');
  }
}
