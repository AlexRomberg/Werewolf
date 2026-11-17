import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Character } from '../../models/character';

@Component({
  selector: 'app-deck-preview',
  imports: [NgOptimizedImage],
  templateUrl: './deck-preview.component.html',
  host: {
    class: 'relative block h-12 mask-alpha overflow-x-clip mask-r-from-80% mask-r-to-100%',
  },
})
export class DeckPreviewComponent {
  public cards = input.required<readonly Character[]>();
}
