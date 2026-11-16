import { Component, model } from '@angular/core';
import { CharacterGrouping } from '../../models/characters/sections';

const GROUPING_LABELS: Record<CharacterGrouping, string> = {
  game: 'Game',
  group: 'Group',
};

@Component({
  selector: 'app-grouping-toggle',
  template: `
    @for (option of options; track option.grouping) {
      <button
        class="chip"
        [class.ring-2]="grouping() === option.grouping"
        [attr.aria-pressed]="grouping() === option.grouping"
        (click)="grouping.set(option.grouping)"
      >
        {{ option.label }}
      </button>
    }
  `,
  host: {
    class: 'flex gap-2',
  },
})
export class GroupingToggleComponent {
  public grouping = model.required<CharacterGrouping>();

  protected options = (Object.keys(GROUPING_LABELS) as CharacterGrouping[]).map((grouping) => ({
    grouping,
    label: GROUPING_LABELS[grouping],
  }));
}
