import { Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LucideCircleMinus, LucideCirclePlus } from '@lucide/angular';
import { BULK_CHARACTERS, CHARACTERS, VILLAGER } from '../../../../models/characters';
import { Character, GAME_SET_LABELS, GROUP_LABELS } from '../../../../models/character';
import { GameService } from '../../../../services/game.service';
import { MAX_SEATS } from '../../../circle/circle.component';

type Grouping = 'group' | 'game';

interface CardView {
  character: Character;
  selected: boolean;
  isBulk: boolean;
  amount: number;
  canDecrease: boolean;
  canIncrease: boolean;
  hint?: string;
}

@Component({
  selector: 'app-cards-panel',
  imports: [NgOptimizedImage, LucideCirclePlus, LucideCircleMinus],
  templateUrl: './cards-panel.component.html',
  styles: ``,
  host: {
    class: 'grid grid-rows-[1fr_auto] min-h-0 gap-4',
  },
})
export class CardsPanelComponent {
  private characters = inject(GameService).characters;

  protected grouping = signal<Grouping>('game');

  protected sections = computed(() =>
    this.grouping() === 'group'
      ? this.groupBy(GROUP_LABELS, (character) => character.group)
      : this.groupBy(GAME_SET_LABELS, (character) => character.game),
  );

  protected toggle(card: CardView) {
    this.characters.toggle(card.character);
  }

  protected increase(card: CardView) {
    this.characters.setAmount(card.character, card.amount + 1);
  }

  protected decrease(card: CardView) {
    this.characters.setAmount(card.character, card.amount - 1);
  }

  private groupBy<T>(labels: ReadonlyMap<T, string>, keyOf: (character: Character) => T) {
    return [...labels].map(([key, label]) => {
      const inSection = CHARACTERS.filter((c) => keyOf(c) === key);
      const isBulk = (character: Character) => BULK_CHARACTERS.includes(character);

      return {
        label,
        cards: [
          ...inSection.filter(isBulk),
          ...inSection.filter((c) => !isBulk(c))]
          .map(
            (c) => this.toCardView(c),
          ),
      };
    });
  }

  private toCardView(character: Character): CardView {
    const amount = this.characters.amountOf(character);
    const minimum = character === VILLAGER ? this.characters.requiredVillagers() : 0;

    return {
      character,
      amount,
      selected: amount > 0,
      isBulk: BULK_CHARACTERS.includes(character),
      canDecrease: amount > minimum,
      canIncrease: amount < MAX_SEATS,
      hint:
        character === VILLAGER && minimum > 0
          ? `Fills the remaining seats.`
          : undefined,
    };
  }
}
