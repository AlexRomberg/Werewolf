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
  readonly MoveDraggedPerson = signal<number | undefined>(undefined);

  private movementLocation = signal<Point>({ x: 0, y: 0 })
  private grabbedElement = signal<{ id: string, x: number, y: number } | undefined>(undefined);
  @ViewChild('svg') svgElement!: ElementRef<SVGElement>;
  @Output() PeopleChange: EventEmitter<Person[]> = new EventEmitter<Person[]>();

  readonly EditModePeople = computed(() => {
    let list = this.People().map((p) => ({ id: p.Id, characterId: p.Character?.Id, name: p.Name }));
    if (this.MoveDraggedPerson()) {
      const grabbedPerson = this.People().findIndex(p => p.Id === this.grabbedElement()?.id);
      if (grabbedPerson >= 0) {
        let shift = this.MoveDraggedPerson()!;
        let newIndex = (grabbedPerson + shift + list.length) % list.length;
        let item = list.splice(grabbedPerson, 1)[0];
        if (grabbedPerson + shift < 0) {
          list.unshift(list.pop()!);
          shift -= 1
        } else if (grabbedPerson + shift >= list.length) {
          list.push(list.shift()!);
          shift -= 1
        }
        list.splice(newIndex, 0, item);
      }
    }

    return list;
  });

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

  private updateFakeElement(x: number, y: number) {
    const boundingBox = this.svgElement?.nativeElement.getBoundingClientRect();
    if (!boundingBox) { return }

    const center = {
      x: boundingBox.x + boundingBox.width / 2,
      y: boundingBox.y + boundingBox.height / 2
    }
    const distance = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);
    if (distance < boundingBox.width / 4) {
      return;
    }

    const topNormalizedAngle = (Math.atan2(y - center.y, x - center.x) + 3.5 * Math.PI);
    const indexOfSelectedPerson = this.People().findIndex(p => p.Id === this.grabbedElement()?.id);
    const angleRelativeToSelectedIndex = (topNormalizedAngle - (2 * Math.PI / this.People().length * indexOfSelectedPerson)) % (2 * Math.PI) - Math.PI;
    const mappedIndex = ((Math.round(this.People().length / (2 * Math.PI) * angleRelativeToSelectedIndex)) + (this.People().length / 2)) % this.People().length - this.People().length / 2;

    this.MoveDraggedPerson.set(mappedIndex);
  }

  IsSelected(index: number) {
    return this.grabbedElement()?.id === this.EditModePeople()[index].id;
  }

  GetEditModeCoordinate(index: number) {
    if (this.IsSelected(index)) {
      return this.movementLocation()
    }

    return this.GetIndexCoordinate(index, this.EditModePeople().length);
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
    let { destination, origin } = this.computeEndpoints(fromIndex, toIndex, this.EditModePeople().length, 300, 0);

    const angle = Math.atan2(destination.y - origin.y, destination.x - origin.x);
    const angle1 = angle + Math.PI / 4; // 45°
    const angle2 = angle - Math.PI / 4; // 45°

    const xA1 = destination.x - 50 * Math.cos(angle1);
    const yA1 = destination.y - 50 * Math.sin(angle1);
    const xA2 = destination.x - 50 * Math.cos(angle2);
    const yA2 = destination.y - 50 * Math.sin(angle2);

    return `M${destination.x},${destination.y}L${xA1},${yA1}M${destination.x},${destination.y}L${xA2},${yA2}`
  }

  grab(elementId: string, evt: MouseEvent | TouchEvent) {
    const location = ("touches" in evt) ? evt.touches[0] : evt;
    this.grabbedElement.set({ id: elementId, x: location.clientX, y: location.clientY });
    this.movementLocation.set(this.translateCoordinate(location.clientX, location.clientY));
  }

  @HostListener("mouseup")
  @HostListener("touchend")
  @HostListener("touchcancel")
  drop() {
    if (this.grabbedElement() !== undefined) {
      this.PeopleChange.emit(this.EditModePeople().map(p => this.People().find(p2 => p2.Id === p.id)!));
    }
    this.grabbedElement.set(undefined);
    this.MoveDraggedPerson.set(undefined);
  }

  @HostListener("mousemove", ['$event'])
  @HostListener("touchmove", ['$event'])
  private handleMove(event: MouseEvent | TouchEvent) {
    if (this.grabbedElement() !== undefined) {
      const location = ("touches" in event) ? event.touches[0] : event;
      this.movementLocation.set(this.translateCoordinate(location.clientX, location.clientY));
      this.updateFakeElement(location.clientX, location.clientY);

      event.stopPropagation();
      event.preventDefault();
    }
  }
}
