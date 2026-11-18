import { Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LucideX } from '@lucide/angular';
import { Character } from '../../models/character';
import { CornersComponent } from '../corners/corners.component';
import { DividerComponent } from '../divider/divider.component';
import { ModalDirective } from '../modal/modal.directive';

@Component({
  imports: [NgOptimizedImage, LucideX, ModalDirective, CornersComponent, DividerComponent],
  selector: 'app-middle-cards-dialog',
  styles: ``,
  templateUrl: './middle-cards-dialog.component.html',
})
export class MiddleCardsDialogComponent {
  public cards = input.required<readonly Character[]>();
  public closed = output<void>();
}
