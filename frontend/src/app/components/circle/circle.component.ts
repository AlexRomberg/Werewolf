import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { LucideUser, LucideX, LucideUserRoundPlus } from '@lucide/angular';
import { NgOptimizedImage } from '@angular/common';
import { Person } from '../../services/state/types';

const GAP_ANGLE = 30;
const TOP_ANGLE = -90;
const ARC_ANGLE = 360 - GAP_ANGLE;
const START_ANGLE = TOP_ANGLE - ARC_ANGLE / 2;
const DRAG_THRESHOLD = 8;
export const MAX_SEATS = 20;

export interface PersonMove {
  id: string;
  toIndex: number;
}

@Component({
  selector: 'app-circle',
  imports: [LucideUser, NgOptimizedImage, LucideX, LucideUserRoundPlus],
  templateUrl: './circle.component.html',
  styleUrl: './circle.component.css',
})
export class CircleComponent {
  public people = input.required<readonly Person[]>();
  public editMode = input(false);

  public personSelected = output<string>();
  public personRemoved = output<string>();
  public personAdded = output<void>();
  public personMoved = output<PersonMove>();

  private stage = viewChild.required<ElementRef<HTMLElement>>('stage');

  protected animated = signal(false);
  protected enterAnimation = computed(() => (this.animated() ? 'player-enter' : ''));

  private pressed: { id: string; pointerId: number; x: number; y: number } | null = null;
  private wasDragged = false;
  private drag = signal<{ id: string; angle: number; toIndex: number } | null>(null);

  protected canAdd = computed(() => this.people().length < MAX_SEATS);
  protected placedPlayers = computed(() => {
    const people = this.people();
    const drag = this.drag();

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
        nameTop: people.length >= 12 && Math.abs(angle - TOP_ANGLE) < 22,
      };
    });
  });

  constructor() {
    afterNextRender(() => this.animated.set(true));
  }

  protected onPointerDown(event: PointerEvent, id: string) {
    this.wasDragged = false;
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
    const angle = (Math.atan2(y, x) * 180) / Math.PI;
    return START_ANGLE + ((((angle - START_ANGLE) % 360) + 360) % 360);
  }

  private slotAt(angle: number) {
    const count = this.people().length;
    const slot = Math.round((angle - START_ANGLE) / (ARC_ANGLE / count) - 0.5);
    return Math.min(Math.max(slot, 0), count - 1);
  }
}

function movedOrder(people: readonly Person[], id: string, toIndex: number) {
  const order = people.map((person) => person.id);
  const [dragged] = order.splice(order.indexOf(id), 1);
  order.splice(toIndex, 0, dragged);
  return order;
}
