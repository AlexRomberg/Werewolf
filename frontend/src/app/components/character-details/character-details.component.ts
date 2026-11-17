import { Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LucideX } from '@lucide/angular';
import { Character } from '../../models/character';
import { CornersComponent } from '../corners/corners.component';
import { DividerComponent } from '../divider/divider.component';
import { ModalDirective } from '../modal/modal.directive';

@Component({
  selector: 'app-character-details',
  imports: [NgOptimizedImage, LucideX, ModalDirective, CornersComponent, DividerComponent],
  templateUrl: './character-details.component.html',
})
export class CharacterDetailsComponent {
  public character = input.required<Character>();
  public closed = output<void>();
}
