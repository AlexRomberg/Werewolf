import { Component, computed, input, output } from '@angular/core';
import type { Person } from '../../services/game.service';
import { LucideUser, LucideX, LucidePlus } from '@lucide/angular';
import { NgOptimizedImage } from '@angular/common';

const RADIUS = 40;
export const MAX_SEATS = 20;

@Component({
  selector: 'app-circle',
  imports: [LucideUser, NgOptimizedImage, LucideX, LucidePlus],
  templateUrl: './circle.component.html',
  styles: ``,
})
export class CircleComponent {
  public people = input.required<readonly Person[]>();
  public editMode = input(false);

  public personSelected = output<string>();
  public personRemoved = output<string>();
  public personAdded = output<void>();

  protected canAdd = computed(() => this.people().length < MAX_SEATS);
  protected placedPlayers = computed(() => {
    const people = this.people();
    return people.map((person, index) => {
      const angle = -Math.PI / 2 + (index / people.length) * Math.PI * 2;
      return {
        person,
        x: 50 + RADIUS * Math.cos(angle),
        y: 50 + RADIUS * Math.sin(angle),
      };
    });
  });
}
