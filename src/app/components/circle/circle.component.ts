import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CircleConnection, CircleConnectionTypes, CirclePerson } from "../../types";

@Component({
    selector: "app-circle",
    standalone: true,
    imports: [],
    templateUrl: "./circle.component.html",
    styleUrl: "./circle.component.css"
})
export class CircleComponent {
    @Input()
    public Connections: CircleConnection[] = [];

    @Input()
    public People: CirclePerson[] = [];

    @Output()
    public personClick: EventEmitter<CirclePerson> = new EventEmitter<CirclePerson>();

    public getCoordinateX(index: number) {
        return 1000 + Math.sin(2 * Math.PI / this.People.length * index) * 875;
    }

    public getCoordinateY(index: number) {
        return 1000 - Math.cos(2 * Math.PI / this.People.length * index) * 875;
    }

    public getConnectionPath(index: number) {
        let originX = this.getCoordinateX(this.Connections[index].from.id);
        let originY = this.getCoordinateY(this.Connections[index].from.id);
        let destinationX = this.getCoordinateX(this.Connections[index].to.id);
        let destinationY = this.getCoordinateY(this.Connections[index].to.id);

        const distanceX = destinationX - originX;
        const distanceY = destinationY - originY;
        const shortenBy = 150;

        const length = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const distanceFractionX = distanceX / length;
        const distanceFractionY = distanceY / length;
        const { before, all } = this.getOtherConnections(this.Connections[index], index);
        const shift = (before - (all + 1) / 2) * 30;

        originX = originX + shortenBy * distanceFractionX + shift * distanceFractionY;
        originY = originY + shortenBy * distanceFractionY - shift * distanceFractionX;
        destinationX = destinationX - shortenBy * distanceFractionX + shift * distanceFractionY;
        destinationY = destinationY - shortenBy * distanceFractionY - shift * distanceFractionX;

        return `M${originX},${originY}L${destinationX},${destinationY}`;
    }

    public getConnectionColor(type: CircleConnectionTypes) {
        switch (type) {
            case CircleConnectionTypes.Love:
                return "red";
            case CircleConnectionTypes.Sleepover:
                return "blue";
            case CircleConnectionTypes.Trust:
                return "orange";
            default:
                return "black";
        }
    }

    public getCrossPath(index: number) {
        const x = this.getCoordinateX(index);
        const y = this.getCoordinateY(index);
        const overshoot = 80;
        return `M${x - overshoot},${y - overshoot}L${x + overshoot},${y + overshoot}M${x - overshoot},${y + overshoot}L${x + overshoot},${y - overshoot}`;
    }

    public getRingColor(person: CirclePerson, layer: number): string {
        const colors = [person.isProtected && "orange", person.isWerewolf && "black", person.isEnchanted && "deepPink", person.isVictim && "red"].filter(Boolean) as string[];
        return colors[layer] ?? (layer == 0 ? "#cbd5e1" : "transparent");
    }

    public onPersonClicked(person: CirclePerson) {
        this.personClick.emit(person);
    }

    public getTextCoordinateX(index: number) {
        const locationX = this.getCoordinateX(index);
        const locationY = this.getCoordinateY(index);

        return locationX + 150 - Math.abs(this.shiftModifyer(locationY)) * 160;
    }

    public getTextCoordinateY(index: number) {
        const locationY = this.getCoordinateY(index);
        return locationY + 20 + this.shiftModifyer(locationY) * 140;
    }

    private getOtherConnections(connection: CircleConnection, index: number) {
        return this.Connections.reduce((prev, curr, idx) => {
            if ((curr.from == connection.from && curr.to == connection.to) || (curr.from == connection.to && curr.to == connection.from)) {
                return {
                    before: prev.before + (idx <= index ? 1 : 0),
                    all: prev.all + 1
                };
            }
            return prev;
        }, { before: 0, all: 0 });
    }

    private shiftModifyer(y: number) {
        if (y < 200) {
            return -1;
        }
        if (y > 1800) {
            return 1;
        }
        return 0;
    }
}
