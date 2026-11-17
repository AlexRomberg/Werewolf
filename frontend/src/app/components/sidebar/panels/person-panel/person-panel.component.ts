import { Component, computed, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideUser } from '@lucide/angular';
import { Character } from '../../../../models/character';
import { Person, PersonStatus, STATUS_LABELS } from '../../../../services/state/types';
import { DividerComponent } from '../../../divider/divider.component';

@Component({
  selector: 'app-person-panel',
  imports: [NgOptimizedImage, LucideUser, FormsModule, DividerComponent],
  templateUrl: './person-panel.component.html',
  host: {
    class: 'grid min-h-0',
  },
})
export class PersonPanelComponent {
  public person = input.required<Person>();
  public characters = input.required<readonly Character[]>();

  public personChanged = output<Person>();

  protected characterOptions = computed(() => [
    { value: undefined, label: $localize`:@@person.selectCharacter:Select a character` },
    ...this.characters().map((character) => ({ value: character.id, label: character.name })),
  ]);

  protected statusOptions = computed(() =>
    Object.values(PersonStatus).map((status) => ({
      status,
      label: STATUS_LABELS[status],
      active: this.person().statuses.includes(status),
    })),
  );

  protected onNameInput(name: string) {
    this.personChanged.emit({ ...this.person(), name });
  }

  protected cleanName() {
    this.personChanged.emit({ ...this.person(), name: this.person().name.trim() });
  }

  protected onCharacterSelect(characterId: string | undefined) {
    const character = this.characters().find((option) => option.id === characterId);
    this.personChanged.emit({ ...this.person(), character });
  }

  protected toggleStatus(status: PersonStatus) {
    const { statuses } = this.person();
    this.personChanged.emit({
      ...this.person(),
      statuses: statuses.includes(status)
        ? statuses.filter((entry) => entry !== status)
        : [...statuses, status],
    });
  }
}
