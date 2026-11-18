import { LandscapeComponent } from '../../components/landscape/landscape.component';
import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormField, form, maxLength, required, schema } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import {
  LucideCheck,
  LucideChevronDown,
  LucideChevronLeft,
  LucideHourglass,
  LucideLogOut,
  LucidePencil,
  LucideRotate3d,
  LucideX,
} from '@lucide/angular';
import { MAX_NAME_LENGTH, type JoinRefusal, type PlayerCard } from '@protocol';
import { DividerComponent } from '../../components/divider/divider.component';
import { PlayerCardComponent } from '../../components/player-card/player-card.component';
import { GROUP_LABELS } from '../../i18n/names';
import { CHARACTERS_BY_ID } from '../../models/characters';
import { RoomPlayerService, RoomStatus } from '../../services/room-player.service';

const UNDEALT_CARD: PlayerCard = {
  name: '',
  characterId: null,
  isDead: false,
  isWerewolf: false,
  isEnchanted: false,
  links: [],
  middleCards: [],
};

const REFUSAL_MESSAGES: Record<Exclude<JoinRefusal, 'host_away'>, string> = {
  room_not_found: $localize`:@@room.refusal.notFound:There is no room with this code. Check it with the narrator.`,
  invalid_request: $localize`:@@room.refusal.invalid:Check the code and your name, and try again.`,
  room_full: $localize`:@@room.refusal.full:Every seat at this table is taken.`,
  room_locked: $localize`:@@room.refusal.locked:The game has already started. You can join the next one.`,
  too_many_attempts: $localize`:@@room.refusal.tooManyAttempts:That was a lot of tries. Wait a minute, then try again.`,
};

const AT_TABLE: readonly RoomStatus[] = ['joined', 'reconnecting', 'host_away'];

const NAME_SCHEMA = schema<{ name: string }>((path) => {
  required(path.name);
  maxLength(path.name, MAX_NAME_LENGTH);
});

@Component({
  selector: 'app-room',
  imports: [
    LandscapeComponent,
    FormField,
    NgOptimizedImage,
    RouterLink,
    PlayerCardComponent,
    DividerComponent,
    LucideCheck,
    LucideChevronDown,
    LucideChevronLeft,
    LucideHourglass,
    LucideLogOut,
    LucidePencil,
    LucideRotate3d,
    LucideX,
  ],
  templateUrl: './room.component.html',
})
export class RoomComponent implements OnInit {
  private player = inject(RoomPlayerService);
  private router = inject(Router);

  public code = input.required<string>();

  protected readonly status = this.player.status;
  protected readonly isAtTable = computed(() => AT_TABLE.includes(this.status()));
  protected readonly refusal = computed(() => {
    const status = this.status();
    return status in REFUSAL_MESSAGES
      ? REFUSAL_MESSAGES[status as keyof typeof REFUSAL_MESSAGES]
      : null;
  });
  protected readonly nameForm = form(signal({ name: '' }), NAME_SCHEMA);

  private readonly renameModel = signal({ name: '' });
  protected readonly renameForm = form(this.renameModel, NAME_SCHEMA);
  protected readonly isRenaming = signal(false);

  protected readonly card = computed(() => this.player.card() ?? UNDEALT_CARD);
  protected readonly displayName = computed(() => this.card().name || this.player.name());
  protected readonly character = computed(
    () => CHARACTERS_BY_ID.get(this.card().characterId ?? '') ?? null,
  );
  private readonly revealed = signal(false);
  protected readonly isFaceUp = computed(
    () => !!this.character() && (this.revealed() || this.card().isDead),
  );
  protected readonly groupLabel = computed(() => {
    const character = this.character();
    return character ? GROUP_LABELS.get(character.group) : undefined;
  });
  protected readonly descriptionSections = computed(
    () =>
      this.character()?.description.filter((section) => section.kind !== 'hintForTheNarrator') ??
      [],
  );
  protected readonly middleCards = computed(() =>
    this.card().middleCards.flatMap((id) => CHARACTERS_BY_ID.get(id) ?? []),
  );
  protected readonly hasDescription = computed(
    () => this.isFaceUp() && this.descriptionSections().length > 0,
  );

  private readonly seenCard = signal<string | null>(null);
  protected readonly hasUnseenCard = computed(
    () => !!this.character() && this.seenCard() !== JSON.stringify(this.card()),
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => this.player.leave());
    effect(() => {
      if (this.isFaceUp()) {
        this.seenCard.set(JSON.stringify(this.card()));
      }
    });
  }

  ngOnInit() {
    this.player.rejoin(this.code());
  }

  protected joinRoom(event: Event) {
    event.preventDefault();
    const name = this.nameForm.name().value().trim();
    if (name) {
      this.player.join(this.code(), name);
    }
  }

  protected takeCardBack() {
    this.player.rejoin(this.code());
  }

  protected startRenaming() {
    this.renameModel.set({ name: this.displayName() });
    this.isRenaming.set(true);
  }

  protected rename(event: Event) {
    event.preventDefault();
    if (this.renameForm().valid()) {
      this.player.rename(this.renameModel().name);
      this.isRenaming.set(false);
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
