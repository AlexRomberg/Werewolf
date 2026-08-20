import { Component, computed, inject, signal } from '@angular/core';
import { CircleComponent, PersonMove } from '../../components/circle/circle.component';
import { GameService } from '../../services/game.service';
import { SidebarComponent, SidebarPanel } from '../../components/sidebar/sidebar.component';
import { SetupPanelComponent } from '../../components/sidebar/panels/setup-panel/setup-panel.component';
import { CardsPanelComponent } from '../../components/sidebar/panels/cards-panel/cards-panel.component';
import { PersonPanelComponent } from '../../components/sidebar/panels/person-panel/person-panel.component';
import { Person } from '../../services/state/types';

@Component({
  selector: 'app-narrator',
  imports: [
    CircleComponent,
    SidebarComponent,
    SetupPanelComponent,
    CardsPanelComponent,
    PersonPanelComponent,
  ],
  templateUrl: './narrator.component.html',
  styles: ``,
})
export class NarratorComponent {
  private game = inject(GameService);

  protected people = this.game.people.all;
  protected cards = this.game.characters.cards;

  private overlay = signal<SidebarPanel | null>(null);
  private basePanel = computed<SidebarPanel>(() => ({ kind: 'setup' }));
  protected panel = computed<SidebarPanel>(() => {
    const overlay = this.overlay();
    if (!overlay) {
      return this.basePanel();
    }

    if (overlay.kind === 'person' && !this.personById(overlay.personId)) {
      return this.basePanel();
    }

    return overlay;
  });

  protected canGoBack = computed(() => this.panel().kind !== this.basePanel().kind);

  protected selectedId = computed(() => {
    const panel = this.panel();
    return panel.kind === 'person' ? panel.personId : null;
  });
  protected selectedPerson = computed(() => this.personById(this.selectedId()));

  protected addPerson() {
    this.game.people.add();
  }

  protected removePerson(id: string) {
    this.game.people.remove(id);
  }

  protected movePerson(move: PersonMove) {
    this.game.people.move(move.id, move.toIndex);
  }

  protected updatePerson(id: string, person: Person) {
    this.game.people.update(id, person);
  }

  protected selectPerson(id: string) {
    this.overlay.set({ kind: 'person', personId: id });
  }

  protected openCardSelector() {
    this.overlay.set({ kind: 'cards' });
  }

  protected closePanel() {
    this.overlay.set(null);
  }

  protected startGame() {}

  private personById(id: string | null) {
    if (!id) {
      return undefined;
    }
    return this.people().find((person) => person.id === id);
  }
}
