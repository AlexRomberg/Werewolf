import { Component, computed, input, output, signal } from '@angular/core';
import {
  LucideCheck,
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronRight,
  LucideHeart,
  LucideRotateCcw,
  LucideShield,
  LucideTombstone,
  LucideUndo2,
  LucideUserPlus,
  LucideZap,
  LucideWandSparkles,
} from '@lucide/angular';
import { NgOptimizedImage } from '@angular/common';
import {
  ActionButton,
  ActionButtonKind,
  ActionCard,
  ActionTone,
  TONE_BY_KIND,
} from '../../../../models/actions/action';
import { Character } from '../../../../models/character';
import { Ability } from '../../../../services/state/types';
import { CharacterTileComponent } from '../../../character-tile/character-tile.component';

const VISIBLE_DEPTH = 3;

const LIFT = [0, 3.5, 5, 5.75];

export interface SpentAbility {
  ability: Ability;
  label: string;
}

interface ButtonView {
  button: ActionButton;
  tone: ActionTone;
  active: boolean;
}

interface StackedCard {
  card: ActionCard;
  buttons: ButtonView[];
  transform: string;
  zIndex: number;
  opacity: number;
  filter: string;
  showsBody: boolean;
}

@Component({
  selector: 'app-narration-panel',
  imports: [
    NgOptimizedImage,
    CharacterTileComponent,
    LucideCheck,
    LucideChevronDown,
    LucideChevronLeft,
    LucideChevronRight,
    LucideHeart,
    LucideRotateCcw,
    LucideShield,
    LucideTombstone,
    LucideWandSparkles,
    LucideUndo2,
    LucideUserPlus,
    LucideZap,
  ],
  templateUrl: './narration-panel.component.html',
  styles: ``,
  host: {
    class: 'flex min-h-0 flex-col gap-4',
  },
})
export class NarrationPanelComponent {
  public cards = input.required<readonly ActionCard[]>();
  public index = input.required<number>();
  public canGoBack = input(false);
  public characters = input<readonly Character[]>([]);
  public activeKind = input<ActionButtonKind | null>(null);
  public activeProgress = input('');
  public spentAbilities = input<readonly SpentAbility[]>([]);

  public next = output<void>();
  public previous = output<void>();
  public buttonPressed = output<ActionButton>();
  public buttonCleared = output<ActionButton>();
  public characterPressed = output<Character>();
  public abilityReset = output<Ability>();

  protected charactersOpen = signal(false);

  protected stack = computed<StackedCard[]>(() => {
    const cards = this.cards();
    const index = this.index();
    const first = Math.max(0, index - 1);

    return cards
      .slice(first, Math.min(cards.length, index + VISIBLE_DEPTH + 1))
      .map((card, offset) => this.toStackedCard(card, first + offset - index));
  });

  protected isLastCard = computed(() => this.index() >= this.cards().length - 1);
  protected progress = computed(() => ((this.index() + 1) / this.cards().length) * 100);

  private toStackedCard(card: ActionCard, depth: number): StackedCard {
    const lift = LIFT[Math.min(depth, VISIBLE_DEPTH)];
    const isCurrent = depth === 0;

    return {
      card,
      buttons: card.buttons.map((button) => ({
        button,
        tone: TONE_BY_KIND[button.kind],
        active: isCurrent && button.kind === this.activeKind(),
      })),
      transform:
        depth < 0 ? 'translateX(130%)' : `translateY(-${lift}rem) scale(${1 - depth * 0.03})`,
      zIndex: 40 - depth,
      opacity: depth < 0 ? 0 : 1,
      filter: depth > 0 ? `brightness(${1 - depth * 0.12})` : 'none',
      showsBody: depth <= 0,
    };
  }
}
