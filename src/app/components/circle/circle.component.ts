import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Connection, ConnectionTypes, Person } from "../../types";

@Component({
    selector: "app-circle",
    standalone: true,
    imports: [],
    templateUrl: "./circle.component.html",
    styleUrl: "./circle.component.css"
})
export class CircleComponent {
    @Input()
    public Connections: Connection[] = [];

    @Input()
    public People: Person[] = [];

    @Output()
    public PersonClick: EventEmitter<Person> = new EventEmitter<Person>();

    public GetCoordinateX(index: number): number {
        return 1000 + Math.sin(2 * Math.PI / this.People.length * index) * 875;
    }

    public GetCoordinateY(index: number): number {
        return 1000 - Math.cos(2 * Math.PI / this.People.length * index) * 875;
    }

    public GetConnectionPath(index: number): string {
        let originX = this.GetCoordinateX(this.Connections[index].From.Id);
        let originY = this.GetCoordinateY(this.Connections[index].From.Id);
        let destinationX = this.GetCoordinateX(this.Connections[index].To.Id);
        let destinationY = this.GetCoordinateY(this.Connections[index].To.Id);

        const distanceX = destinationX - originX;
        const distanceY = destinationY - originY;
        const shortenBy = 150;

        const length = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const distanceFractionX = distanceX / length;
        const distanceFractionY = distanceY / length;
        const { Before: before, All: all } = this.getOtherConnections(this.Connections[index], index);
        const shift = (before - (all + 1) / 2) * 30;

        originX = originX + shortenBy * distanceFractionX + shift * distanceFractionY;
        originY = originY + shortenBy * distanceFractionY - shift * distanceFractionX;
        destinationX = destinationX - shortenBy * distanceFractionX + shift * distanceFractionY;
        destinationY = destinationY - shortenBy * distanceFractionY - shift * distanceFractionX;

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
        return colors[layer] ?? (layer == 0 ? "#cbd5e1" : "transparent");
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

    private getOtherConnections(connection: Connection, index: number): { Before: number, All: number } {
        return this.Connections.reduce((prev, curr, idx) => {
            if ((curr.From == connection.From && curr.To == connection.To) || (curr.From == connection.To && curr.To == connection.From)) {
                return {
                    Before: prev.Before + (idx <= index ? 1 : 0),
                    All: prev.All + 1
                };
            }
            return prev;
        }, { Before: 0, All: 0 });
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
