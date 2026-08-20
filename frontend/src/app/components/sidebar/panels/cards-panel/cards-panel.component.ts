import { Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LucideCircleMinus, LucideCirclePlus, LucideUsers } from '@lucide/angular';
import { BULK_CHARACTERS, CHARACTERS, VILLAGER } from '../../../../models/characters';
import { Character, GAME_SET_LABELS, GROUP_LABELS } from '../../../../models/character';
import { GameService } from '../../../../services/game.service';
import { MAX_SEATS } from '../../../circle/circle.component';
import { Preset, PRESETS, presetDeck, presetEntries } from '../../../../models/presets';

type Grouping = 'group' | 'game';

interface PresetView {
  preset: Preset;
  deck: readonly Character[];
}

const PRESET_VIEWS: readonly PresetView[] = PRESETS.map((preset) => ({
  preset,
  deck: presetDeck(preset),
}));

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
  imports: [NgOptimizedImage, LucideCirclePlus, LucideCircleMinus, LucideUsers],
  templateUrl: './cards-panel.component.html',
  styles: ``,
  host: {
    class: 'grid grid-rows-[1fr_auto] min-h-0 gap-4',
  },
})
export class CardsPanelComponent {
  private game = inject(GameService);
  private characters = this.game.characters;

  protected grouping = signal<Grouping>('game');
  protected presetsExpanded = signal(false);

  private recommended = computed(() => {
    const seats = this.game.people.all().length;
    return PRESET_VIEWS.filter((p) => p.deck.length <= seats).sort(
      (a, b) => b.deck.length - a.deck.length,
    )[0];
  });

  protected presets = computed(() => {
    const recommended = this.recommended();
    return this.presetsExpanded()
      ? [recommended, ...PRESET_VIEWS.filter((view) => view !== recommended)]
      : [recommended];
  });

  protected hiddenPresetCount = computed(() => PRESET_VIEWS.length - 1);

  protected applyPreset(view: PresetView) {
    this.characters.replaceSelection(presetEntries(view.preset));
  }

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
        cards: [...inSection.filter(isBulk), ...inSection.filter((c) => !isBulk(c))].map((c) =>
          this.toCardView(c),
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
      hint: character === VILLAGER && minimum > 0 ? `Fills the remaining seats.` : undefined,
    };
  }
}
