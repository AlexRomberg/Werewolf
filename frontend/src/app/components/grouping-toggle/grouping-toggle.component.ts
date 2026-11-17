import { Component, model } from '@angular/core';
import { CharacterGrouping } from '../../models/characters/sections';

const GROUPING_LABELS: Record<CharacterGrouping, string> = {
  game: $localize`:@@grouping.game:Game`,
  group: $localize`:@@grouping.group:Group`,
};

@Component({
  selector: 'app-grouping-toggle',
  templateUrl: './grouping-toggle.component.html',
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
