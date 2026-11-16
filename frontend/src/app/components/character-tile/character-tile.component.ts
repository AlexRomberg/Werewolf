import { Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Character } from '../../models/character';

@Component({
  selector: 'app-character-tile',
  imports: [NgOptimizedImage],
  template: `
    <button
      class="card-tile grid-cols-[auto_1fr] hover:bg-zinc-700"
      [class.ring-2]="selected()"
      (click)="pressed.emit()"
    >
      <span class="size-12 rounded-sm bg-zinc-950 p-1">
        <img width="40" height="40" [ngSrc]="'img/' + character().id + '.png'" alt="" />
      </span>
      <span class="text-sm text-zinc-400">{{ character().name }}</span>
    </button>
  `,
  styles: ``,
  host: {
    class: 'grid',
  },
})
export class CharacterTileComponent {
  public character = input.required<Character>();
  public selected = input(false);

  public pressed = output<void>();
}
