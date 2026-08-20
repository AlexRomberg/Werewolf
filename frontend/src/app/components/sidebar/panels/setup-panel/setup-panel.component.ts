import { Component, computed, inject, input, model, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LucideArrowRight, LucideChevronRight, LucideTriangleAlert } from '@lucide/angular';
import { Character } from '../../../../models/character';
import { GameService } from '../../../../services/game.service';

@Component({
  selector: 'app-setup-panel',
  imports: [NgOptimizedImage, LucideChevronRight, LucideTriangleAlert],
  templateUrl: './setup-panel.component.html',
  styles: ``,
  host: {
    class: 'grid grid-rows-[1fr_auto] min-h-0 gap-4',
  },
})
export class SetupPanelComponent {
  public cards = input.required<readonly Character[]>();
  public state = inject(GameService);
  // public useVirtualCards = model(false);

  public cardSelectorPressed = output<void>();
  public gameStartPressed = output<void>();

  protected showCardMissmatch = computed(() => {
    return this.state.characters.excessCards() > 0;
  });
}
