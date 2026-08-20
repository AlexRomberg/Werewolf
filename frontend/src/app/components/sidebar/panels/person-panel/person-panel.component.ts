import { Component, computed, inject, input, output } from '@angular/core';
import { Person } from '../../../../services/state/types';
import { NgOptimizedImage } from '@angular/common';
import { LucideUser } from '@lucide/angular';
import { CHARACTERS, CHARACTERS_BY_ID } from '../../../../models/characters';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../../../services/game.service';

@Component({
  selector: 'app-person-panel',
  imports: [NgOptimizedImage, LucideUser, FormsModule],
  templateUrl: './person-panel.component.html',
  styles: ``,
  host: {
    class: 'grid grid-rows-[1fr_auto] min-h-0 gap-4',
  },
})
export class PersonPanelComponent {
  public person = input.required<Person>();
  private game = inject(GameService);

  public personChanged = output<Person>();

  protected options = computed(() => [
    { value: undefined, label: 'Select a character' },
    ...[...new Set(this.game.characters.cards())].map((character) => ({
      value: character.id,
      label: character.name,
    })),
  ]);

  protected onNameInput(name: string) {
    this.personChanged.emit({ ...this.person(), name });
  }

  protected cleanName() {
    this.personChanged.emit({ ...this.person(), name: this.person().name.trim() });
  }

  protected onCharacterSelect(characterId: string | undefined) {
    const character = characterId ? CHARACTERS_BY_ID.get(characterId) : undefined;
    this.personChanged.emit({ ...this.person(), character });
  }
}
