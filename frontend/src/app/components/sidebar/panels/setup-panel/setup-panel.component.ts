import { Component, input, output } from '@angular/core';
import { LucideChevronRight, LucideTriangleAlert } from '@lucide/angular';
import { Character } from '../../../../models/character';
import { DeckPreviewComponent } from '../../../deck-preview/deck-preview.component';
import { DividerComponent } from '../../../divider/divider.component';
import { ToggleSwitchComponent } from '../../../toggle-switch/toggle-switch.component';

@Component({
  selector: 'app-setup-panel',
  imports: [
    DeckPreviewComponent,
    DividerComponent,
    ToggleSwitchComponent,
    LucideChevronRight,
    LucideTriangleAlert,
  ],
  templateUrl: './setup-panel.component.html',
  host: {
    class: 'grid grid-rows-[1fr_auto] min-h-0 gap-4',
  },
})
export class SetupPanelComponent {
  public cards = input.required<readonly Character[]>();
  public hasExcessCards = input(false);
  public virtualCards = input(false);

  public cardSelectorPressed = output<void>();
  public gameStartPressed = output<void>();
  public virtualCardsToggled = output<boolean>();
}
