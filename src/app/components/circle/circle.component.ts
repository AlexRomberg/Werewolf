import { Component, EventEmitter, inject, Output, input } from "@angular/core";
import { Connection, ConnectionTypes } from "../../types";
import { Person } from "../../models/state/person";
import { StateService } from "../../services/state.service";

@Component({
    selector: "app-circle",
    imports: [],
    templateUrl: "./circle.component.html",
    styleUrl: "./circle.component.css"
})
export class CircleComponent {
    private gameState = inject(StateService);
    public readonly Connections = input<Connection[]>([]);
    public readonly People = input<Person[]>([]);

    @Output()
    public PersonClick: EventEmitter<Person> = new EventEmitter<Person>();

    public GetCoordinateX(index: number): number {
        return 1000 + Math.sin(2 * Math.PI / this.People().length * index) * 875;
    }

    public GetCoordinateY(index: number): number {
        return 1000 - Math.cos(2 * Math.PI / this.People().length * index) * 875;
    }

    public GetConnectionPath(connectionType: ConnectionTypes): string {
        const connection = this.Connections().find(c => c.ConnectionType === connectionType);
        console.log("GetConnectionPath", connectionType.toString(), this.Connections(), connection);

        if (!connection) {
            return "";
        }

        let originID = this.gameState.People.findIndex(p => p.Id === connection.From.Id);
        let destinationID = this.gameState.People.findIndex(p => p.Id === connection.To.Id);

        if (originID < destinationID) {
            const temp = originID;
            originID = destinationID;
            destinationID = temp;
        }

        let originX = this.GetCoordinateX(originID);
        let originY = this.GetCoordinateY(originID);
        let destinationX = this.GetCoordinateX(destinationID);
        let destinationY = this.GetCoordinateY(destinationID);

        const distanceX = destinationX - originX;
        const distanceY = destinationY - originY;
        const shortenBy = 150;

        const length = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const distanceFractionX = distanceX / length;
        const distanceFractionY = distanceY / length;
        const shift = this.getConnectionOffset(connection, connectionType) * 40;


        originX = originX + shortenBy * distanceFractionX + shift * distanceFractionY;
        originY = originY + shortenBy * distanceFractionY - shift * distanceFractionX;
        destinationX = destinationX - shortenBy * distanceFractionX + shift * distanceFractionY;
        destinationY = destinationY - shortenBy * distanceFractionY - shift * distanceFractionX;

        console.log("out", `M${originX},${originY}L${destinationX},${destinationY}`);
        return `M${originX},${originY}L${destinationX},${destinationY}`;
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

    public GetCrossPath(index: number): string {
        const x = this.GetCoordinateX(index);
        const y = this.GetCoordinateY(index);
        const overshoot = 80;
        return `M${x - overshoot},${y - overshoot}L${x + overshoot},${y + overshoot}M${x - overshoot},${y + overshoot}L${x + overshoot},${y - overshoot}`;
    }

    public OnPersonClicked(person: Person): void {
        this.PersonClick.emit(person);
    }

    public GetTextCoordinateX(index: number): number {
        const locationX = this.GetCoordinateX(index);
        const locationY = this.GetCoordinateY(index);

        return locationX + 150 - Math.abs(this.shiftModifyer(locationY)) * 160;
    }

    public GetTextCoordinateY(index: number): number {
        const locationY = this.GetCoordinateY(index);
        return locationY + 20 + this.shiftModifyer(locationY) * 140;
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

    private shiftModifyer(y: number): number {
        if (y < 200) {
            return -1;
        }
        if (y > 1800) {
            return 1;
        }
        return 0;
    }
}
/*

0  0 -> 0
1  0 -> 0
1  1 -> 1
2  0 -> 0
2  1 -> 0.5
2  2 -> 1
*/