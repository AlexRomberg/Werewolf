import { Component, computed, inject, signal } from '@angular/core';
import { LucideArrowUpDown, LucideCheck, LucideLogOut } from '@lucide/angular';
import {
  ChangesDialogComponent,
  MorningChange,
} from '../../components/changes-dialog/changes-dialog.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import {
  CircleComponent,
  CircleSelection,
  PersonMove,
} from '../../components/circle/circle.component';
import { GameService } from '../../services/game.service';
import { SidebarComponent, SidebarPanel } from '../../components/sidebar/sidebar.component';
import { SetupPanelComponent } from '../../components/sidebar/panels/setup-panel/setup-panel.component';
import { CardsPanelComponent } from '../../components/sidebar/panels/cards-panel/cards-panel.component';
import { PersonPanelComponent } from '../../components/sidebar/panels/person-panel/person-panel.component';
import {
  Ability,
  ABILITY_LABELS,
  ConnectionType,
  DaybreakChange,
  Person,
} from '../../services/state/types';
import { CHARACTERS_BY_ID } from '../../models/characters';
import { NarrationPanelComponent } from '../../components/sidebar/panels/narration-panel/narration-panel.component';
import { CharacterDetailsComponent } from '../../components/character-details/character-details.component';
import { ActionButton, TONE_BY_KIND } from '../../models/actions/action';
import {
  activeButton,
  isStayingHome,
  pickWarning,
  SelectionChoice,
} from '../../models/actions/selection';
import { Character } from '../../models/character';
import { applyPick, clearPick } from './pick-actions';
import { isAppliable } from '../../services/state/DaybreakState';

interface PendingPick {
  selectionKey: string;
  personId: string;
  warning: string;
}

const SidebarTitles: Record<SidebarPanel['kind'], string | undefined> = {
  setup: 'Setup',
  cards: 'Card selection',
  person: 'Person details',
  narration: undefined,
};

function getNightTitle(round: number) {
  return round === 0 ? 'First night' : `Night ${round + 1}`;
}

@Component({
  selector: 'app-narrator',
  imports: [
    CircleComponent,
    SidebarComponent,
    SetupPanelComponent,
    CardsPanelComponent,
    PersonPanelComponent,
    NarrationPanelComponent,
    CharacterDetailsComponent,
    LucideArrowUpDown,
    LucideCheck,
    LucideLogOut,
    ConfirmDialogComponent,
    ChangesDialogComponent,
  ],
  templateUrl: './narrator.component.html',
  styles: ``,
})
export class NarratorComponent {
  private game = inject(GameService);

  private people = this.game.people.all;
  protected seats = this.game.people.views;
  protected cards = this.game.characters.cards;
  protected excessCards = this.game.characters.excessCards;

  private overlay = signal<SidebarPanel | null>(null);
  private basePanel = computed<SidebarPanel>(() =>
    this.game.phase() === 'playing' ? { kind: 'narration' } : { kind: 'setup' },
  );
  protected panel = computed<SidebarPanel>(() => {
    const overlay = this.overlay();
    if (!overlay) {
      return this.basePanel();
    }

    if (overlay.kind === 'person' && !this.personById(overlay.personId)) {
      return this.basePanel();
    }

    return overlay;
  });
  protected title = computed(() =>
    this.panel().kind === 'narration'
      ? getNightTitle(this.game.actions.round())
      : SidebarTitles[this.panel().kind],
  );
  protected isPlaying = computed(() => this.game.phase() === 'playing');
  protected rearranging = signal(false);
  protected confirmingEnd = signal(false);
  protected isEditMode = computed(() => !this.isPlaying() || this.rearranging());
  protected connections = this.game.night.connections;
  protected actionCards = this.game.actions.queue;
  protected actionIndex = this.game.actions.index;
  protected canStepBack = this.game.actions.canGoBack;

  protected canGoBack = computed(() => this.panel().kind !== this.basePanel().kind);

  protected selectedId = computed(() => {
    const panel = this.panel();
    return panel.kind === 'person' ? panel.personId : null;
  });
  protected selectedPerson = computed(() => this.personById(this.selectedId()));

  protected charactersInPlay = this.game.characters.inPlay;
  protected describedCharacter = signal<Character | null>(null);

  protected spentAbilities = computed(() =>
    this.game.night.roles().usedAbilities.map((ability) => ({
      ability,
      label: ABILITY_LABELS[ability],
    })),
  );
  protected resettingAbility = signal<Ability | null>(null);
  protected resettingLabel = computed(() => {
    const ability = this.resettingAbility();
    return ability ? ABILITY_LABELS[ability] : '';
  });

  protected morning = signal<'review' | 'leaving' | null>(null);
  protected morningChanges = computed<MorningChange[]>(() =>
    this.game.daybreak.changes().flatMap((change) => {
      const person = this.seatOf(change.personId);
      return person
        ? [
            {
              change,
              person,
              causedBy:
                'role' in change.causedBy
                  ? CHARACTERS_BY_ID.get(change.causedBy.role)
                  : this.seatOf(change.causedBy.person),
              appliable: isAppliable(change),
              applied: this.game.daybreak.isApplied(change),
            },
          ]
        : [];
    }),
  );

  private currentCard = this.game.actions.current;
  private currentContext = this.game.actions.currentContext;

  private selectionChoice = signal<SelectionChoice | null>(null);
  private partialPick = signal<{ selectionKey: string; ids: readonly string[] }>({
    selectionKey: '',
    ids: [],
  });
  private pendingPick = signal<PendingPick | null>(null);

  protected activeButton = computed(() =>
    this.panel().kind === 'narration' && !this.rearranging()
      ? activeButton(this.currentCard(), this.selectionChoice())
      : undefined,
  );
  private selectionKey = computed(() => {
    const button = this.activeButton();
    return button ? `${this.currentCard()?.key}:${button.kind}` : '';
  });
  private picked = computed(() => {
    const partial = this.partialPick();
    return partial.selectionKey === this.selectionKey() ? partial.ids : [];
  });
  protected pickProgress = computed(
    () => `${this.picked().length}/${this.activeButton()?.picks ?? 0}`,
  );

  protected circleSelection = computed<CircleSelection | null>(() => {
    const button = this.activeButton();
    const card = this.currentCard();
    const context = this.currentContext();
    if (!button || !card || !context) {
      return null;
    }

    const pending = this.pendingPick();
    return {
      tone: TONE_BY_KIND[button.kind],
      label: button.kind === 'assign-card' ? `Select ${card.title}` : button.label,
      needed: button.picks ?? 0,
      picked: this.picked(),
      cautioned: this.people()
        .filter((person) => pickWarning(button, card.id, person, context))
        .map((person) => person.id),
      pending: pending?.selectionKey === this.selectionKey() ? pending : undefined,
    };
  });

  protected addPerson() {
    this.game.people.add();
  }

  protected removePerson(id: string) {
    this.game.people.remove(id);
  }

  protected movePerson(move: PersonMove) {
    this.game.people.move(move.id, move.toIndex);
  }

  protected updatePerson(id: string, person: Person) {
    this.game.people.update(id, person);
  }

  protected selectPerson(id: string) {
    if (this.activeButton()) {
      this.pickPerson(id);
    } else {
      this.overlay.set({ kind: 'person', personId: id });
    }
  }

  protected confirmPick() {
    const pending = this.circleSelection()?.pending;
    this.pendingPick.set(null);
    if (pending) {
      this.addPick(pending.personId);
    }
  }

  protected cancelPick() {
    this.pendingPick.set(null);
  }

  protected closeSelection() {
    const card = this.currentCard();
    this.selectionChoice.set(card ? { cardKey: card.key, kind: null } : null);
  }

  protected openCardSelector() {
    this.overlay.set({ kind: 'cards' });
  }

  protected closePanel() {
    this.overlay.set(null);
  }

  protected startGame() {
    this.game.startGame();
  }

  protected endGame() {
    this.game.endGame();
    this.rearranging.set(false);
    this.confirmingEnd.set(false);
    this.resettingAbility.set(null);
    this.overlay.set(null);
    this.selectionChoice.set(null);
    this.morning.set(null);
    this.discardPicks();
  }

  protected resetAbility() {
    const ability = this.resettingAbility();
    this.resettingAbility.set(null);
    if (ability) {
      this.game.resetAbility(ability);
    }
  }

  protected nextAction() {
    this.discardPicks();
    if (this.game.actions.isLastCard() && this.game.daybreak.pending().length > 0) {
      this.morning.set('leaving');
    } else {
      this.game.actions.next();
    }
  }

  protected applyChange(change: DaybreakChange) {
    this.game.daybreak.apply(change);
  }

  protected applyAllChanges() {
    this.game.daybreak.applyAll();
  }

  protected leaveMorning() {
    this.morning.set(null);
    this.game.actions.next();
  }

  protected previousAction() {
    this.discardPicks();
    this.game.actions.back();
  }

  protected pressButton(button: ActionButton) {
    const card = this.currentCard();
    if (!card) {
      return;
    }

    switch (button.kind) {
      case 'lose-fox-request':
        this.game.night.useAbility('fox_request');
        break;
      case 'infect':
        this.game.night.infectWolfVictim();
        break;
      case 'show-daybreak-changes':
        this.morning.set('review');
        break;
      default:
        if (button.picks !== undefined) {
          this.selectionChoice.set({ cardKey: card.key, kind: button.kind });
        }
    }
  }

  protected clearButton(button: ActionButton) {
    const card = this.currentCard();
    if (card) {
      clearPick(this.game, card, button);
      this.closeSelection();
    }
  }

  private pickPerson(id: string) {
    const button = this.activeButton();
    const card = this.currentCard();
    const context = this.currentContext();
    const person = this.personById(id);
    if (!button || !card || !context || !person) {
      return;
    }

    if (this.picked().includes(id)) {
      this.setPicked(this.picked().filter((picked) => picked !== id));
      return;
    }

    if (isStayingHome(button, person, context)) {
      this.game.night.disconnect(ConnectionType.Sleepover);
      this.closeSelection();
      return;
    }

    const warning = pickWarning(button, card.id, person, context);
    if (warning) {
      this.pendingPick.set({ selectionKey: this.selectionKey(), personId: id, warning });
    } else {
      this.addPick(id);
    }
  }

  private addPick(id: string) {
    const button = this.activeButton();
    const card = this.currentCard();
    if (!button || !card) {
      return;
    }

    const ids = [...this.picked(), id];
    if (ids.length < (button.picks ?? 0)) {
      this.setPicked(ids);
      return;
    }

    // A pick the narrator asked for by pressing its button ends there; one that started
    // by itself hands over to the next ability that starts by itself.
    const wasPressed = this.selectionChoice()?.cardKey === card.key;
    this.setPicked([]);
    applyPick(this.game, card, button, ids);
    if (wasPressed) {
      this.closeSelection();
    }
  }

  private discardPicks() {
    this.setPicked([]);
    this.pendingPick.set(null);
  }

  private setPicked(ids: readonly string[]) {
    this.partialPick.set({ selectionKey: this.selectionKey(), ids });
  }

  private seatOf(personId: string) {
    return this.seats().find((seat) => seat.id === personId);
  }

  private personById(id: string | null) {
    if (!id) {
      return undefined;
    }
    return this.people().find((person) => person.id === id);
  }
}
