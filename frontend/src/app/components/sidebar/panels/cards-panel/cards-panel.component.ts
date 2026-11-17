import { Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LucideCircleMinus, LucideCirclePlus, LucideUsers } from '@lucide/angular';
import { Character } from '../../../../models/character';
import { BULK_CHARACTERS, VILLAGER } from '../../../../models/characters';
import { CharacterGrouping, characterSections } from '../../../../models/characters/sections';
import { Preset, PRESETS, presetDeck, presetEntries } from '../../../../models/presets';
import { GameService } from '../../../../services/game.service';
import { MAX_SEATS } from '../../../../services/state/types';
import { CharacterTileComponent } from '../../../character-tile/character-tile.component';
import { DeckPreviewComponent } from '../../../deck-preview/deck-preview.component';
import { GroupingToggleComponent } from '../../../grouping-toggle/grouping-toggle.component';

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
  fewerLabel: string;
  moreLabel: string;
  hint?: string;
}

@Component({
  selector: 'app-cards-panel',
  imports: [
    NgOptimizedImage,
    LucideCirclePlus,
    LucideCircleMinus,
    LucideUsers,
    CharacterTileComponent,
    DeckPreviewComponent,
    GroupingToggleComponent,
  ],
  templateUrl: './cards-panel.component.html',
  host: {
    class: 'grid grid-rows-[1fr_auto] min-h-0 gap-4',
  },
})
export class CardsPanelComponent {
  private game = inject(GameService);
  private characters = this.game.characters;

  protected grouping = signal<CharacterGrouping>('game');
  protected presetsExpanded = signal(false);

  protected sections = computed(() =>
    characterSections(this.grouping()).map(({ label, characters }) => ({
      label,
      cards: characters.map((character) => this.toCardView(character)),
    })),
  );

  private recommendedPreset = computed(() => {
    const seatCount = this.game.people.all().length;
    return (
      PRESET_VIEWS.filter((view) => view.deck.length <= seatCount).sort(
        (a, b) => b.deck.length - a.deck.length,
      )[0] ?? PRESET_VIEWS[0]
    );
  });

  protected presets = computed(() => {
    const recommended = this.recommendedPreset();
    return this.presetsExpanded()
      ? [recommended, ...PRESET_VIEWS.filter((view) => view !== recommended)]
      : [recommended];
  });

  protected readonly hiddenPresetCount = PRESET_VIEWS.length - 1;

  protected applyPreset(view: PresetView) {
    this.characters.replaceSelection(presetEntries(view.preset));
  }

  protected toggle(card: CardView) {
    this.characters.toggle(card.character);
  }

  protected increase(card: CardView) {
    this.characters.setAmount(card.character, card.amount + 1);
  }

  protected decrease(card: CardView) {
    this.characters.setAmount(card.character, card.amount - 1);
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
      fewerLabel: $localize`:@@cards.fewer:One fewer ${character.name}:character:`,
      moreLabel: $localize`:@@cards.more:One more ${character.name}:character:`,
      hint:
        character === VILLAGER && minimum > 0
          ? $localize`:@@cards.villagerHint:Fills the remaining seats.`
          : undefined,
    };
  }
}
