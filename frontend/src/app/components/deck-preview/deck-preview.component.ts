import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Character } from '../../models/character';

/** A hand of cards fanned out in a row, fading out where it runs past its box. */
@Component({
  selector: 'app-deck-preview',
  imports: [NgOptimizedImage],
  template: `
    @for (character of cards(); track $index) {
      <div
        class="absolute size-12 rounded-sm bg-zinc-950 p-1 shadow shadow-black/50"
        [style.left.px]="20 * $index"
        [style.zIndex]="30 - $index"
      >
        <img width="40" height="40" [ngSrc]="character.image" [alt]="'card ' + character.name" />
      </div>
    }
  `,
  host: {
    class:
      'relative block h-12 mask-alpha overflow-x-clip mask-r-from-80% mask-r-to-100% rounded-sm',
  },
})
export class DeckPreviewComponent {
  public cards = input.required<readonly Character[]>();
}
