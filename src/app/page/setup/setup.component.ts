import { Component } from '@angular/core';
import { Thief } from '../../models/roles/thief';
import { Cupit } from '../../models/roles/cupit';
import { WildChild } from '../../models/roles/wildChild';
import { Seer } from '../../models/roles/seer';
import { Witch } from '../../models/roles/witch';
import { FormsModule } from '@angular/forms';
import { GameStateService } from '../../services/game-state.service';
import { Router } from '@angular/router';
import { Angel } from '../../models/roles/angel';
import { BearGuide } from '../../models/roles/bearGuide';
import { BigWolf } from '../../models/roles/bigWolf';
import { Role } from '../../models/roles/roles';
import { Brothers } from '../../models/roles/brothers';
import { DogWolf } from '../../models/roles/dogWolf';
import { FlutePlayer } from '../../models/roles/flutePlayer';
import { Fox } from '../../models/roles/fox';
import { Healer } from '../../models/roles/healer';
import { Hunter } from '../../models/roles/hunter';
import { Juggler } from '../../models/roles/juggler';
import { Knight } from '../../models/roles/knight';
import { Old } from '../../models/roles/old';
import { OldMan } from '../../models/roles/oldMan';
import { PrimalWolf } from '../../models/roles/primalWolf';
import { Scapegoat } from '../../models/roles/scapegoat';
import { Sisters } from '../../models/roles/sisters';
import { SmallChild } from '../../models/roles/smallChild';
import { VillageIdiot } from '../../models/roles/villageIdiot';
import { Villager } from '../../models/roles/villager';
import { Werewolf } from '../../models/roles/werewolf';
import { Bitch } from '../../models/roles/bitch';
import { WhiteWolf } from '../../models/roles/whiteWolf';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css'
})
export class SetupComponent {
  public Roles: { wolfs: { instance: Role, selected: boolean }[], active: { instance: Role, selected: boolean }[], passive: { instance: Role, selected: boolean }[], loner: { instance: Role, selected: boolean }[] } = {
    wolfs: [
      { instance: new Werewolf(), selected: false },
      { instance: new PrimalWolf(), selected: false },
      { instance: new WildChild(), selected: false },
      { instance: new WhiteWolf(), selected: false },
      { instance: new BigWolf(), selected: false },
      { instance: new DogWolf(), selected: false },
    ],
    active: [
      { instance: new Witch(), selected: false },
      { instance: new Seer(), selected: false },
      { instance: new Thief(), selected: false },
      { instance: new Cupit(), selected: false },
      { instance: new Healer(), selected: false },
      { instance: new SmallChild(), selected: false },
      { instance: new Bitch(), selected: false },
      { instance: new Brothers(), selected: false },
      { instance: new Sisters(), selected: false },
      { instance: new Scapegoat(), selected: false },
      { instance: new Fox(), selected: false },
    ],
    passive: [
      { instance: new Villager(), selected: false },
      { instance: new Hunter(), selected: false },
      { instance: new Knight(), selected: false },
      { instance: new BearGuide(), selected: false },
      { instance: new Old(), selected: false },
      { instance: new VillageIdiot(), selected: false },
      { instance: new Juggler(), selected: false },
    ],
    loner: [
      { instance: new Angel(), selected: false },
      { instance: new OldMan(), selected: false },
      { instance: new FlutePlayer(), selected: false },
    ],
  };

  public PeopleCount = 1;

  constructor(private state: GameStateService, private router: Router) {
  }

  public StartGame() {
    this.state.Characters = [
      ...this.Roles.active,
      ...this.Roles.passive,
      ...this.Roles.loner,
      ...this.Roles.wolfs
    ].filter(r => r.selected).sort((ra, rb) => (ra.instance.Priority ?? -1) - (rb.instance.Priority ?? -1)).map(r => r.instance);

    this.state.Connections = [];
    this.state.People = this.state.People.slice(0, this.PeopleCount);
    for (let i = 0; i < this.PeopleCount; i++) {
      const person = this.state.People[i];
      this.state.People[i] = { role: undefined, victim: false, protected: false, dead: false, id: i, name: person?.name ?? "" };
    }
    this.router.navigateByUrl('/narrator');
  }
}
