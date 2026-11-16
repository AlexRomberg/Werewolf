import { Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormField, form, maxLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideChevronDown,
  LucideChevronRight,
  LucideHourglass,
  LucideLogOut,
  LucideRotate3d,
} from '@lucide/angular';
import { MAX_NAME_LENGTH, type JoinRefusal, type PlayerCard } from '@protocol';
import { PlayerCardComponent } from '../../components/player-card/player-card.component';
import { GROUP_LABELS, SectionTitles } from '../../models/character';
import { CHARACTERS_BY_ID } from '../../models/characters';
import { RoomPlayerService } from '../../services/room-player.service';

const UNDEALT_CARD: PlayerCard = {
  characterId: null,
  isDead: false,
  isWerewolf: false,
  isEnchanted: false,
  links: [],
};

const REFUSAL_MESSAGES: Record<JoinRefusal, string> = {
  room_not_found: 'There is no room with this code. Check it with the narrator.',
  name_missing: 'Enter your name to take a seat.',
  room_full: 'Every seat at this table is taken.',
  room_locked:
    'The game has already started. Only a player who dropped out can come back, under the same name.',
  host_unreachable: "The narrator's device did not answer. Try again.",
};

@Component({
  selector: 'app-room',
  imports: [
    FormField,
    NgOptimizedImage,
    RouterLink,
    PlayerCardComponent,
    LucideArrowLeft,
    LucideChevronDown,
    LucideChevronRight,
    LucideHourglass,
    LucideLogOut,
    LucideRotate3d,
  ],
  templateUrl: './room.component.html',
})
export class RoomComponent {
  private player = inject(RoomPlayerService);
  private router = inject(Router);

  /** The room's code, from the route. */
  public code = input.required<string>();

  protected readonly status = this.player.status;
  protected readonly refusal = computed(() => {
    const status = this.status();
    return status in REFUSAL_MESSAGES ? REFUSAL_MESSAGES[status as JoinRefusal] : null;
  });
  protected readonly nameForm = form(signal({ name: '' }), (path) => {
    required(path.name);
    maxLength(path.name, MAX_NAME_LENGTH);
  });

  protected readonly playerName = computed(() => this.nameForm.name().value().trim());

  protected readonly card = computed(() => this.player.card() ?? UNDEALT_CARD);
  protected readonly character = computed(
    () => CHARACTERS_BY_ID.get(this.card().characterId ?? '') ?? null,
  );
  private readonly revealed = signal(false);
  /** Only a dealt card can be turned. A dead player's card lies open on the table for everyone. */
  protected readonly isFaceUp = computed(
    () => !!this.character() && (this.revealed() || this.card().isDead),
  );
  protected readonly groupLabel = computed(() => {
    const character = this.character();
    return character ? GROUP_LABELS.get(character.group) : undefined;
  });
  /** What the role says about itself, without the advice meant for the narrator. */
  protected readonly descriptionSections = computed(
    () =>
      this.character()?.description.filter(
        (section) => section.title !== SectionTitles.hintForTheNarrator,
      ) ?? [],
  );

  protected readonly hasDescription = computed(
    () => this.isFaceUp() && this.descriptionSections().length > 0,
  );

  /** The card as the player last saw it face up, serialized. */
  private readonly seenCard = signal<string | null>(null);
  /** A card was dealt or changed that the player has not looked at yet. */
  protected readonly hasUnseenCard = computed(
    () => !!this.character() && this.seenCard() !== JSON.stringify(this.card()),
  );

  constructor() {
    // Leaving the page leaves the room, which the narrator's table hears about.
    inject(DestroyRef).onDestroy(() => this.player.leave());
    effect(() => {
      if (this.isFaceUp()) {
        this.seenCard.set(JSON.stringify(this.card()));
      }
    });
  }

  protected joinRoom(event: Event) {
    event.preventDefault();
    const name = this.nameForm.name().value().trim();
    if (name) {
      this.player.join({ code: this.code(), name });
    }
  }

  protected flipCard() {
    this.revealed.update((revealed) => !revealed);
  }

  protected leaveRoom() {
    this.player.leave();
    this.router.navigate(['/']);
  }
}
