import { Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LucideArrowRight, LucideChevronRight } from '@lucide/angular';
import { Character } from '../../../../models/character';

@Component({
  selector: 'app-setup-panel',
  imports: [NgOptimizedImage, LucideArrowRight, LucideChevronRight],
  templateUrl: './setup-panel.component.html',
  styles: ``,
  host: {
    class: 'grid grid-rows-[1fr_auto] min-h-0 gap-4',
  },
})
export class SetupPanelComponent {
  public cards = input.required<readonly Character[]>();
  public canStart = input(false);

  public cardSelectorPressed = output<void>();
  public gameStartPressed = output<void>();

  protected cardTransform = (index: number) => ({
    left: index * 20,
    top: (Math.sin(index) * 2.5) + 2,
    rotate: `rotate(${Math.sin(index) * 2}deg)`,
    z: 30 - index,
  })
}
