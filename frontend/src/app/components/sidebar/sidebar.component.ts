import { Component, inject, input, model, signal } from '@angular/core';
import { GameService } from '../../services/game.service';
import { FormsModule } from '@angular/forms';
import { LucideArrowRight, LucideChevronRight } from "@lucide/angular";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule, LucideArrowRight, LucideChevronRight, NgOptimizedImage],
  templateUrl: './sidebar.component.html',
  styles: ``,
  host: {
    class: 'grid max-h-screen',
  }
})
export class SidebarComponent {
  protected title = input("Setup");
  private state = inject(GameService);
  protected virtualCards = signal(false);
  protected cards = this.state.characters.cards;

  protected canStart = this.state.canStart;

  setVirtualCards(value: boolean) {
    this.virtualCards.set(value);
  }

  sin(x: number) {
    return Math.sin(x);
  }
}
