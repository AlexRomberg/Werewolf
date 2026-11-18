import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  LucideCheck,
  LucideHeartPulse,
  LucidePawPrint,
  LucideShield,
  LucideSword,
  LucideTombstone,
  LucideUser,
  LucideUserRoundPlus,
  LucideWandSparkles,
  LucideX,
} from '@lucide/angular';
import { NgOptimizedImage } from '@angular/common';
import { ActionTone } from '../../models/actions/action';
import {
  Connection,
  ConnectionType,
  MAX_SEATS,
  Person,
  PersonView,
  PersonBadge,
  STATUS_LABELS,
} from '../../services/state/types';

const GAP_ANGLE = 30;
const TOP_ANGLE = -90;
const ARC_ANGLE = 360 - GAP_ANGLE;
const START_ANGLE = TOP_ANGLE - ARC_ANGLE / 2;
const CENTER = 50;
const RADIUS = 40;
const DRAG_THRESHOLD = 8;
const LANE_GAP = 6;
const CROWDED_SEAT_COUNT = 12;
const NAME_ABOVE_SPREAD = 22;

const NOT_BACKGROUND = '.player, button, a, [role="status"], [role="alertdialog"]';

const CONNECTION_LABELS: Record<ConnectionType, string> = {
  [ConnectionType.Love]: $localize`:@@connection.love:In love`,
  [ConnectionType.Trust]: $localize`:@@connection.trust:Role model`,
  [ConnectionType.Sleepover]: $localize`:@@connection.sleepover:Sleepover`,
};

const BADGE_TONES: Record<PersonBadge, ActionTone> = {
  protected: 'protect',
  healed: 'protect',
  victim: 'kill',
  enchanted: 'enchant',
  turned_wolf: 'neutral',
  wounded: 'kill',
};

export interface PersonMove {
  id: string;
  toIndex: number;
}

export interface CircleSelection {
  tone: ActionTone;
  label: string;
  needed: number;
  picked: readonly string[];
  cautioned: readonly string[];
  pending?: { personId: string; warning: string };
}

@Component({
  selector: 'app-circle',
  imports: [
    NgOptimizedImage,
    LucideCheck,
    LucideHeartPulse,
    LucidePawPrint,
    LucideShield,
    LucideSword,
    LucideTombstone,
    LucideWandSparkles,
    LucideUser,
    LucideUserRoundPlus,
    LucideX,
  ],
  templateUrl: './circle.component.html',
  styleUrl: './circle.component.css',
})
export class CircleComponent {
  public people = input.required<readonly PersonView[]>();
  public editMode = input(false);
  public selectedPersonId = input<string | null>(null);
  public selection = input<CircleSelection | null>(null);
  public connections = input<readonly Connection[]>([]);

  public personSelected = output<string>();
  public personRemoved = output<string>();
  public personAdded = output<void>();
  public personMoved = output<PersonMove>();
  public selectionClosed = output<void>();
  public pickConfirmed = output<void>();
  public pickCancelled = output<void>();

  private stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private cancelButton = viewChild<ElementRef<HTMLButtonElement>>('cancelButton');

  protected animated = signal(false);
  protected enterAnimation = computed(() => (this.animated() ? 'player-enter' : ''));

  private pressed: { id: string; pointerId: number; x: number; y: number } | null = null;
  private wasDragged = false;
  private drag = signal<{ id: string; angle: number; toIndex: number } | null>(null);

  protected readonly confirmPickLabel = $localize`:@@circle.confirmPick:Confirm this pick`;
  protected canAdd = computed(() => this.people().length < MAX_SEATS);
  protected placedPeople = computed(() => {
    const people = this.people();
    const drag = this.drag();
    const selectedPersonId = this.selectedPersonId();
    const selection = this.selection();

    const order = drag ? movedOrder(people, drag.id, drag.toIndex) : people.map(({ id }) => id);
    const angleStep = ARC_ANGLE / people.length;
    return people.map((person) => {
      const dragging = drag?.id === person.id;
      const angle = dragging
        ? drag.angle
        : START_ANGLE + (order.indexOf(person.id) + 0.5) * angleStep;
      return {
        person,
        angle,
        dragging,
        selected: !selection && person.id === selectedPersonId,
        pick: selection ? pickStateOf(person.id, selection) : null,
        label: ariaLabelOf(person),
        removeLabel: $localize`:@@circle.removePerson:Remove ${person.displayName}:person:`,
        badges: person.badges.map((badge) => ({
          kind: badge,
          tone: BADGE_TONES[badge],
          label: STATUS_LABELS[badge],
        })),
        nameAbove:
          people.length >= CROWDED_SEAT_COUNT && Math.abs(angle - TOP_ANGLE) < NAME_ABOVE_SPREAD,
      };
    });
  });

  protected connectionLines = computed(() => {
    const connections = this.connections();
    const angles = new Map(this.placedPeople().map(({ person, angle }) => [person.id, angle]));

    return connections.flatMap((connection) => {
      const [first, second] = [connection.from, connection.to].sort();
      const from = angles.get(first);
      const to = angles.get(second);
      if (from === undefined || to === undefined) {
        return [];
      }

      const siblings = connections.filter(
        (other) => [other.from, other.to].sort().join() === [first, second].join(),
      );
      const lane = siblings.indexOf(connection) - (siblings.length - 1) / 2;

      const start = seatPoint(from);
      const end = seatPoint(to);
      return [
        {
          type: connection.type,
          label: CONNECTION_LABELS[connection.type],
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2,
          length: Math.hypot(end.x - start.x, end.y - start.y),
          angle: toDegrees(Math.atan2(end.y - start.y, end.x - start.x)),
          shift: lane * LANE_GAP,
        },
      ];
    });
  });

  constructor() {
    afterNextRender(() => this.animated.set(true));
    effect(() => this.cancelButton()?.nativeElement.focus());
  }

  protected onEscape() {
    if (this.selection()?.pending) {
      this.pickCancelled.emit();
    } else if (this.selection()) {
      this.selectionClosed.emit();
    }
  }

  protected onBackgroundClick(event: MouseEvent) {
    const selection = this.selection();
    const target = event.target as Element | null;
    if (selection && !selection.pending && !target?.closest(NOT_BACKGROUND)) {
      this.selectionClosed.emit();
    }
  }

  protected onPointerDown(event: PointerEvent, id: string) {
    this.wasDragged = false;
    if (!this.editMode()) {
      return;
    }

    this.pressed = { id, pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    (event.currentTarget as Element).setPointerCapture(event.pointerId);
  }

  protected onPointerMove(event: PointerEvent) {
    const pressed = this.pressed;
    if (!pressed || pressed.pointerId !== event.pointerId) {
      return;
    }

    const travelled = Math.hypot(event.clientX - pressed.x, event.clientY - pressed.y);
    if (!this.drag() && travelled < DRAG_THRESHOLD) {
      return;
    }

    const angle = this.pointerAngle(event);
    this.drag.set({ id: pressed.id, angle, toIndex: this.slotAt(angle) });
  }

  protected onPointerUp() {
    const drag = this.drag();
    this.pressed = null;
    this.drag.set(null);
    if (!drag) {
      return;
    }

    this.wasDragged = true;
    this.personMoved.emit({ id: drag.id, toIndex: drag.toIndex });
  }

  protected onPointerCancel() {
    this.pressed = null;
    this.drag.set(null);
  }

  protected onSelect(id: string) {
    if (this.wasDragged) {
      this.wasDragged = false;
      return;
    }

    this.personSelected.emit(id);
  }

  private pointerAngle(event: PointerEvent) {
    const stage = this.stage().nativeElement.getBoundingClientRect();
    const x = event.clientX - (stage.left + stage.width / 2);
    const y = event.clientY - (stage.top + stage.height / 2);
    const angle = toDegrees(Math.atan2(y, x));
    return START_ANGLE + ((((angle - START_ANGLE) % 360) + 360) % 360);
  }

  private slotAt(angle: number) {
    const count = this.people().length;
    const slot = Math.round((angle - START_ANGLE) / (ARC_ANGLE / count) - 0.5);
    return Math.min(Math.max(slot, 0), count - 1);
  }
}

interface Point {
  x: number;
  y: number;
}

function toDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

function seatPoint(angle: number): Point {
  const radians = (angle * Math.PI) / 180;
  return { x: CENTER + RADIUS * Math.cos(radians), y: CENTER + RADIUS * Math.sin(radians) };
}

function ariaLabelOf(person: PersonView) {
  return [
    person.displayName,
    person.character?.name,
    person.isDead && STATUS_LABELS.dead,
    ...person.badges.map((badge) => STATUS_LABELS[badge]),
  ]
    .filter(Boolean)
    .join(', ');
}

type PickState = 'pending' | 'picked' | 'cautioned' | 'open';

function pickStateOf(id: string, selection: CircleSelection): PickState {
  if (selection.pending?.personId === id) {
    return 'pending';
  }
  if (selection.picked.includes(id)) {
    return 'picked';
  }
  return selection.cautioned.includes(id) ? 'cautioned' : 'open';
}

function movedOrder(people: readonly Person[], id: string, toIndex: number) {
  const order = people.map((person) => person.id);
  const [dragged] = order.splice(order.indexOf(id), 1);
  order.splice(toIndex, 0, dragged);
  return order;
}
