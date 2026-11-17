import { Component, computed, effect, inject, signal } from '@angular/core';
import { LucideArrowLeft, LucideArrowUpDown, LucideCheck, LucideLogOut } from '@lucide/angular';
import {
  ChangesDialogComponent,
  DaybreakChangeView,
} from '../../components/changes-dialog/changes-dialog.component';
import { CharacterDetailsComponent } from '../../components/character-details/character-details.component';
import { RoomInviteComponent } from '../../components/room-invite/room-invite.component';
import {
  CircleComponent,
  CircleSelection,
  PersonMove,
} from '../../components/circle/circle.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { CardsPanelComponent } from '../../components/sidebar/panels/cards-panel/cards-panel.component';
import { NarrationPanelComponent } from '../../components/sidebar/panels/narration-panel/narration-panel.component';
import { PersonPanelComponent } from '../../components/sidebar/panels/person-panel/person-panel.component';
import { SetupPanelComponent } from '../../components/sidebar/panels/setup-panel/setup-panel.component';
import { SidebarComponent, SidebarPanel } from '../../components/sidebar/sidebar.component';
import { ActionButton, TONE_BY_KIND } from '../../models/actions/action';
import { withDealShuffledButton } from '../../models/actions/generic-cards';
import {
  activeButton,
  isStayingHome,
  pickWarning,
  SelectionChoice,
} from '../../models/actions/selection';
import { Character } from '../../models/character';
import { CHARACTERS_BY_ID } from '../../models/characters';
import { GameService } from '../../services/game.service';
import { RoomHostService, RoomSeating } from '../../services/room-host.service';
import { isAppliable } from '../../services/state/daybreak-state';
import {
  Ability,
  ABILITY_LABELS,
  ConnectionType,
  DaybreakChange,
  Person,
} from '../../services/state/types';
import { applyPick, clearPick } from './pick-actions';
import { RouterLink } from '@angular/router';

interface PendingPick {
  selectionKey: string;
  personId: string;
  warning: string;
}

interface PartialPick {
  selectionKey: string;
  personIds: readonly string[];
}

const SIDEBAR_TITLES: Record<SidebarPanel['kind'], string | undefined> = {
  setup: 'Setup',
  cards: 'Card selection',
  person: 'Person details',
  narration: undefined,
};

function nightTitle(round: number) {
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
    ConfirmDialogComponent,
    ChangesDialogComponent,
    RoomInviteComponent,
    LucideArrowUpDown,
    LucideCheck,
    LucideLogOut,
    LucideArrowLeft,
    RouterLink,
  ],
  templateUrl: './narrator.component.html',
})
export class NarratorComponent {
  private game = inject(GameService);
  private roomHost = inject(RoomHostService);

  private people = this.game.people.all;
  protected personViews = this.game.people.views;
  protected connections = this.game.night.connections;
  protected isPlaying = computed(() => this.game.phase() === 'playing');
  protected rearranging = signal(false);
  protected isEditMode = computed(() => !this.isPlaying() || this.rearranging());
  protected confirmingEnd = signal(false);

  private overlayPanel = signal<SidebarPanel | null>(null);
  private basePanel = computed<SidebarPanel>(() =>
    this.isPlaying() ? { kind: 'narration' } : { kind: 'setup' },
  );
  protected panel = computed<SidebarPanel>(() => {
    const overlay = this.overlayPanel();
    const isOfRemovedPerson = overlay?.kind === 'person' && !this.personById(overlay.personId);
    return overlay && !isOfRemovedPerson ? overlay : this.basePanel();
  });
  protected panelTitle = computed(() =>
    this.panel().kind === 'narration'
      ? nightTitle(this.game.actions.round())
      : SIDEBAR_TITLES[this.panel().kind],
  );
  protected canClosePanel = computed(() => this.panel().kind !== this.basePanel().kind);

  protected selectedPersonId = computed(() => {
    const panel = this.panel();
    return panel.kind === 'person' ? panel.personId : null;
  });
  protected selectedPerson = computed(() => this.personById(this.selectedPersonId()));

  protected cards = this.game.characters.cards;
  protected hasExcessCards = computed(() => this.game.characters.excessCards() > 0);

  protected isHostingRoom = this.roomHost.isHosting;
  protected isRoomConnected = this.roomHost.isConnected;
  protected roomCode = this.roomHost.code;
  protected confirmingDeal = signal(false);

  private readonly seating: RoomSeating = {
    seat: (name) => {
      if (this.isPlaying()) {
        return { refused: 'room_locked' };
      }
      const personId = this.game.people.takeSeat(name);
      return personId ? { personId } : { refused: 'room_full' };
    },
    hasSeat: (personId) => !!this.personById(personId),
    rename: (personId, name) => {
      const person = this.personById(personId);
      if (person) {
        this.game.people.update(personId, { ...person, name });
      }
    },
    vacate: (personId) => {
      if (!this.isPlaying()) {
        this.game.people.remove(personId);
      }
    },
  };

  protected actionCards = computed(() => {
    const cards = this.game.actions.queue();
    if (!this.isHostingRoom()) {
      return cards;
    }

    const hasDealt = this.people().some((person) => person.character);
    return cards.map((card) =>
      card.id === 'rules' ? withDealShuffledButton(card, hasDealt) : card,
    );
  });
  protected actionIndex = this.game.actions.index;
  protected canStepBack = this.game.actions.canGoBack;
  private currentCard = this.game.actions.current;
  private currentContext = this.game.actions.currentContext;

  protected charactersInPlay = this.game.characters.inPlay;
  protected describedCharacter = signal<Character | null>(null);

  protected spentAbilities = computed(() =>
    this.game.night.roles().usedAbilities.map((ability) => ({
      ability,
      label: ABILITY_LABELS[ability],
    })),
  );
  protected resettingAbility = signal<Ability | null>(null);
  protected resettingAbilityLabel = computed(() => {
    const ability = this.resettingAbility();
    return ability ? ABILITY_LABELS[ability] : '';
  });

  private selectionChoice = signal<SelectionChoice | null>(null);
  private partialPick = signal<PartialPick>({ selectionKey: '', personIds: [] });
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
  private pickedIds = computed(() => {
    const partial = this.partialPick();
    return partial.selectionKey === this.selectionKey() ? partial.personIds : [];
  });
  protected pickProgress = computed(
    () => `${this.pickedIds().length}/${this.activeButton()?.picks ?? 0}`,
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
      picked: this.pickedIds(),
      cautioned: this.people()
        .filter((person) => pickWarning(button, card.id, person, context))
        .map((person) => person.id),
      pending: pending?.selectionKey === this.selectionKey() ? pending : undefined,
    };
  });

  protected daybreakDialog = signal<'review' | 'leaving' | null>(null);
  protected daybreakChangeViews = computed<DaybreakChangeView[]>(() =>
    this.game.daybreak.changes().flatMap((change) => {
      const person = this.personViewById(change.personId);
      if (!person) {
        return [];
      }

      return {
        change,
        person,
        causedBy:
          'role' in change.causedBy
            ? CHARACTERS_BY_ID.get(change.causedBy.role)
            : this.personViewById(change.causedBy.person),
        appliable: isAppliable(change),
        applied: this.game.daybreak.isApplied(change),
      };
    }),
  );

  constructor() {
    effect(() => this.roomHost.deal(this.game.people.cards()));
    if (this.roomHost.hasRoomToResume()) {
      this.roomHost.open(this.seating);
    }
  }

  protected addPerson() {
    this.game.people.add();
  }

  protected removePerson(id: string) {
    this.roomHost.kick(id);
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
      this.overlayPanel.set({ kind: 'person', personId: id });
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
    this.overlayPanel.set({ kind: 'cards' });
  }

  protected closePanel() {
    this.overlayPanel.set(null);
  }

  protected toggleVirtualCards(enabled: boolean) {
    if (enabled) {
      this.roomHost.open(this.seating);
    } else {
      this.roomHost.close();
    }
  }

  protected dealShuffled() {
    if (this.people().some((person) => person.character) && !this.confirmingDeal()) {
      this.confirmingDeal.set(true);
      return;
    }

    this.confirmingDeal.set(false);
    this.game.dealShuffled();
  }

  protected startGame() {
    this.game.startGame();
  }

  protected endGame() {
    this.game.endGame();
    this.rearranging.set(false);
    this.confirmingEnd.set(false);
    this.resettingAbility.set(null);
    this.overlayPanel.set(null);
    this.selectionChoice.set(null);
    this.daybreakDialog.set(null);
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
      this.daybreakDialog.set('leaving');
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

  protected proceedToNextNight() {
    this.daybreakDialog.set(null);
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
        this.daybreakDialog.set('review');
        break;
      case 'deal-shuffled':
        this.dealShuffled();
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

    if (this.pickedIds().includes(id)) {
      this.setPickedIds(this.pickedIds().filter((pickedId) => pickedId !== id));
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

    const ids = [...this.pickedIds(), id];
    if (ids.length < (button.picks ?? 0)) {
      this.setPickedIds(ids);
      return;
    }

    const wasPressed = this.selectionChoice()?.cardKey === card.key;
    this.setPickedIds([]);
    applyPick(this.game, card, button, ids);
    if (wasPressed) {
      this.closeSelection();
    }
  }

  private discardPicks() {
    this.setPickedIds([]);
    this.pendingPick.set(null);
  }

  private setPickedIds(personIds: readonly string[]) {
    this.partialPick.set({ selectionKey: this.selectionKey(), personIds });
  }

  private personById(id: string | null) {
    return this.people().find((person) => person.id === id);
  }

  private personViewById(id: string) {
    return this.personViews().find((view) => view.id === id);
  }
}
