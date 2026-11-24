import { Component, computed, input, model, output } from '@angular/core';
import {
  LucideCheck,
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronRight,
  LucideEye,
  LucideHeart,
  LucidePlayingCardsFan,
  LucideRotateCcw,
  LucideShield,
  LucideSmartphone,
  LucideTombstone,
  LucideUndo2,
  LucideUserPlus,
  LucideWandSparkles,
  LucideZap,
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
import { CornersComponent } from '../../../corners/corners.component';
import { DeckPreviewComponent } from '../../../deck-preview/deck-preview.component';
import { DividerComponent } from '../../../divider/divider.component';

const VISIBLE_DEPTH = 3;
const LIFT_BY_DEPTH = [0, 3.5, 5, 5.75];

export interface SpentAbility {
  ability: Ability;
  label: string;
}

interface ButtonView {
  button: ActionButton;
  tone: ActionTone;
  active: boolean;
  undoLabel: string;
}

interface StackedCard {
  card: ActionCard;
  buttons: ButtonView[];
  transform: string;
  zIndex: number;
  opacity: number;
  filter: string;
  showsBody: boolean;
  isCurrent: boolean;
}

@Component({
  selector: 'app-narration-panel',
  imports: [
    NgOptimizedImage,
    CharacterTileComponent,
    CornersComponent,
    DeckPreviewComponent,
    DividerComponent,
    LucideCheck,
    LucideChevronDown,
    LucideChevronLeft,
    LucideChevronRight,
    LucideEye,
    LucideHeart,
    LucidePlayingCardsFan,
    LucideRotateCcw,
    LucideShield,
    LucideSmartphone,
    LucideTombstone,
    LucideWandSparkles,
    LucideUndo2,
    LucideUserPlus,
    LucideZap,
  ],
  templateUrl: './narration-panel.component.html',
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
  public spentAbilities = input<readonly SpentAbility[]>([]);

  public next = output<void>();
  public previous = output<void>();
  public buttonPressed = output<ActionButton>();
  public buttonCleared = output<ActionButton>();
  public characterPressed = output<Character>();
  public abilityReset = output<Ability>();

  public charactersOpen = model(false);

  protected spentViews = computed(() =>
    this.spentAbilities().map((spent) => ({
      ...spent,
      giveBackLabel: $localize`:@@narration.giveBackAbility:Give back: ${spent.label}:ability:`,
    })),
  );

  protected stack = computed<StackedCard[]>(() => {
    const cards = this.cards();
    const index = this.index();
    const first = Math.max(0, index - 1);

    return cards
      .slice(first, Math.min(cards.length, index + VISIBLE_DEPTH + 1))
      .map((card, offset) => this.toStackedCard(card, first + offset - index));
  });

  protected isLastCard = computed(() => this.index() >= this.cards().length - 1);

  private toStackedCard(card: ActionCard, depth: number): StackedCard {
    const lift = LIFT_BY_DEPTH[Math.min(depth, VISIBLE_DEPTH)];
    const isCurrent = depth === 0;

    return {
      card,
      buttons: card.buttons.map((button) => ({
        button,
        tone: TONE_BY_KIND[button.kind],
        active: isCurrent && button.kind === this.activeKind(),
        undoLabel: $localize`:@@narration.undoButton:Undo: ${button.label}:action:`,
      })),
      transform:
        depth < 0 ? 'translateX(130%)' : `translateY(-${lift}rem) scale(${1 - depth * 0.03})`,
      zIndex: 40 - depth,
      opacity: depth < 0 ? 0 : 1,
      filter: depth > 0 ? `brightness(${1 - depth * 0.12})` : 'none',
      showsBody: depth <= 0,
      isCurrent,
    };
  }
}
