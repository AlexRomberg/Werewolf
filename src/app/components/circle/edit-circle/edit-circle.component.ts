import { Component, computed, ElementRef, EventEmitter, HostListener, input, Output, signal, ViewChild } from '@angular/core';
import { CircleShared } from '../circle.shared';
import { Person } from '../../../models/state/person';
import { Point } from '../../../types';

@Component({
  selector: 'app-edit-circle',
  imports: [],
  templateUrl: './edit-circle.component.html',
  styleUrl: './edit-circle.component.css'
})
export class EditCircleComponent extends CircleShared {
  readonly People = input<Person[]>([]);
  readonly StaticPeople = computed(() => this.People().filter(p => p !== this.grabbedPerson()));
  grabbedPerson = signal<Person | undefined>(undefined);
  movementPosition = signal<Point>({ x: 1000, y: 1000 });
  movementIndex = computed(() => {
    return this.getIndexByCoordinate(this.movementPosition());
  })

  @ViewChild('svg') svgElement!: ElementRef<SVGElement>;
  @Output() PeopleChange: EventEmitter<Person[]> = new EventEmitter<Person[]>();

  IsSelected(index: number) {
    return this.grabbedPerson() === this.People()[index];
  }

  GetEditModeCoordinate(index: number) {
    let offsetIndex = index;
    if (this.grabbedPerson()) {
      if (index === this.movementIndex()) {
        offsetIndex += 0.2;
      } else if (((index + 1) % this.StaticPeople().length) === this.movementIndex()) {
        offsetIndex -= 0.2;
      }
    }
    return this.GetIndexCoordinate(offsetIndex, this.StaticPeople().length);
  }

  grab(elementId: string, evt: MouseEvent | TouchEvent) {
    this.grabbedPerson.set(this.People().find(p => p.Id === elementId));

    const pos = this.getPositionFromEvent(evt);
    this.movementPosition.set(this.translateCoordinate(pos.x, pos.y));
  }

  @HostListener("mouseup")
  @HostListener("touchend")
  @HostListener("touchcancel")
  private drop() {
    if (this.grabbedPerson() !== undefined) {
      const people = this.StaticPeople()
      people.splice(((this.movementIndex()) % this.StaticPeople().length), 0, this.grabbedPerson()!)
      this.PeopleChange.emit(people);
    }
    this.grabbedPerson.set(undefined);
  }

  @HostListener("mousemove", ['$event'])
  @HostListener("touchmove", ['$event'])
  private handleMove(event: MouseEvent | TouchEvent) {
    if (this.grabbedPerson() !== undefined) {
      const pos = this.getPositionFromEvent(event);
      this.movementPosition.set(this.translateCoordinate(pos.x, pos.y));

      event.stopPropagation();
      event.preventDefault();
    }
  }

  private translateCoordinate(x: number, y: number) {
    const boundingBox = this.svgElement?.nativeElement.getBoundingClientRect();
    if (!boundingBox) {
      return { x: 0, y: 0 };
    }

    return {
      x: ((x - boundingBox.x) / boundingBox.width) * 2000,
      y: ((y - boundingBox.y) / boundingBox.height) * 2000
    }
  }

  private getPositionFromEvent(event: MouseEvent | TouchEvent) {
    const normalizedEvent = ("touches" in event) ? event.touches[0] : event
    return { x: normalizedEvent.clientX, y: normalizedEvent.clientY };
  }

  private getIndexByCoordinate(position: Point) {
    const interval = Math.PI * 2 / this.StaticPeople().length
    const topNormalizedAngle = (Math.atan2(position.y - 1000, position.x - 1000) + 2.5 * Math.PI) % (2 * Math.PI);
    return Math.ceil(topNormalizedAngle / interval) % this.StaticPeople().length;
  }

  GetMovementHintPath() {
    return this.GetPathDescription(0, Math.floor(this.People().length / 2), this.People().length, 0, 300);
  }

  GetMovementHintArrowPaths() {
    return [
      this.GetArrowPathDescription(0, Math.floor(this.People().length / 2)),
      this.GetArrowPathDescription(Math.floor(this.People().length / 2), 0)
    ];
  }

  private GetArrowPathDescription(fromIndex: number, toIndex: number) {
    let { destination, origin } = this.computeEndpoints(fromIndex, toIndex, this.People().length, 300, 0);

    const angle = Math.atan2(destination.y - origin.y, destination.x - origin.x);
    const angle1 = angle + Math.PI / 4; // 45°
    const angle2 = angle - Math.PI / 4; // 45°

    const xA1 = destination.x - 50 * Math.cos(angle1);
    const yA1 = destination.y - 50 * Math.sin(angle1);
    const xA2 = destination.x - 50 * Math.cos(angle2);
    const yA2 = destination.y - 50 * Math.sin(angle2);

    return `M${destination.x},${destination.y}L${xA1},${yA1}M${destination.x},${destination.y}L${xA2},${yA2}`
  }
}
