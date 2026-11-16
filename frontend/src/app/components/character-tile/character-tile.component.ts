import { Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Character } from '../../models/character';

@Component({
  selector: 'app-character-tile',
  imports: [NgOptimizedImage],
  templateUrl: './character-tile.component.html',
  host: {
    class: 'grid',
  },
})
export class CharacterTileComponent {
  public character = input.required<Character>();
  public selected = input(false);

  public pressed = output<void>();
}
