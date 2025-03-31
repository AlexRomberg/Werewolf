import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { Person } from '../../../models/state/person';
import { Connection, ConnectionTypes, Point } from '../../../types';
import { StateService } from '../../../services/state.service';
import { CircleShared } from '../circle.shared';

@Component({
  selector: 'app-people-circle',
  imports: [],
  templateUrl: './people-circle.component.html',
  styleUrl: './people-circle.component.css'
})
export class PeopleCircleComponent extends CircleShared {
  private gameState = inject(StateService);
  readonly Connections = input<Connection[]>([]);
  readonly People = input<Person[]>([]);

  @Output()
  PersonClick: EventEmitter<Person> = new EventEmitter<Person>();

  public OnPersonClicked(person: Person): void {
    this.PersonClick.emit(person);
  }

  GetCoordinate(index: number) {
    return this.GetIndexCoordinate(index, this.People().length);
  }

  public GetConnectionColor(type: ConnectionTypes): string {
    switch (type) {
      case ConnectionTypes.Love:
        return "red";
      case ConnectionTypes.Sleepover:
        return "blue";
      case ConnectionTypes.Trust:
        return "orange";
      default:
        return "black";
    }
  }

  public GetRingColor(person: Person, layer: number): string {
    const colors = [person.IsProtected && "orange", person.IsWerewolf && "black", person.IsEnchanted && "deepPink", person.IsVictim && "red"].filter(Boolean) as string[];
    return colors[layer] ?? (layer == 0 ? "#6d6e7e" : "transparent");
  }

  GetConnectionPath(connectionType: ConnectionTypes) {
    const connection = this.Connections().find(c => c.ConnectionType === connectionType);

    if (!connection) {
      return "";
    }

    let originID = this.gameState.People.findIndex(p => p.Id === connection.From.Id);
    let destinationID = this.gameState.People.findIndex(p => p.Id === connection.To.Id);
    const offset = this.getConnectionOffset(connection, connectionType) * 40;

    return this.GetPathDescription(originID, destinationID, this.People().length, offset)
  }

  public GetTextCoordinate(index: number): Point {
    const location = this.GetIndexCoordinate(index, this.People().length);

    return {
      x: location.x + 150 - Math.abs(this.textShiftModifyer(location.y)) * 160,
      y: location.y + 20 + this.textShiftModifyer(location.y) * 140
    };
  }

  public GetCrossPath(index: number): string {
    const x = this.GetIndexCoordinate(index, this.People().length).x;
    const y = this.GetIndexCoordinate(index, this.People().length).y;
    const overshoot = 80;
    return `M${x - overshoot},${y - overshoot}L${x + overshoot},${y + overshoot}M${x - overshoot},${y + overshoot}L${x + overshoot},${y - overshoot}`;
  }

  private textShiftModifyer(y: number): number {
    if (y < 400) {
      return -1;
    }
    if (y > 1600) {
      return 1;
    }
    return 0;
  }

  private getConnectionOffset(connection: Connection, type: ConnectionTypes): number {
    const value = new Map<Partial<ConnectionTypes>, number>();
    for (const checkConnection of this.Connections()) {
      if ((checkConnection.From.Id === connection.From.Id && checkConnection.To.Id === connection.To.Id)
        || (checkConnection.From.Id === connection.To.Id && checkConnection.To.Id === connection.From.Id)) {
        value.set(checkConnection.ConnectionType, value.size);
      }
    };

    return value.get(type)! - (value.size - 1) / 2;
  }
}
