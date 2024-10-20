import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CircleConnection, CircleConnectionTypes, CirclePerson } from '../../types';

@Component({
    selector: 'app-circle',
    standalone: true,
    imports: [],
    templateUrl: './circle.component.html',
    styleUrl: './circle.component.css'
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

    private getOtherConnections(connection: CircleConnection, index: number) {
        return this.Connections.reduce((prev, curr, idx) => {
            if ((curr.from == connection.from && curr.to == connection.to) || (curr.from == connection.to && curr.to == connection.from)) {
                return {
                    before: prev.before + (idx <= index ? 1 : 0),
                    all: prev.all + 1
                }
            }
            return prev;
        }, { before: 0, all: 0 });
    }

    public getConnectionPath(index: number) {
        let originX = this.getCoordinateX(this.Connections[index].from.id);
        let originY = this.getCoordinateY(this.Connections[index].from.id);
        let destinationX = this.getCoordinateX(this.Connections[index].to.id);
        let destinationY = this.getCoordinateY(this.Connections[index].to.id);

        let distanceX = destinationX - originX;
        let distanceY = destinationY - originY;
        let shortenBy = 150;

        let length = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        let distanceFractionX = distanceX / length;
        let distanceFractionY = distanceY / length;
        const { before, all } = this.getOtherConnections(this.Connections[index], index)
        const shift = (before - (all + 1) / 2) * 30;

        originX = originX + shortenBy * distanceFractionX + shift * distanceFractionY;
        originY = originY + shortenBy * distanceFractionY - shift * distanceFractionX;
        destinationX = destinationX - shortenBy * distanceFractionX + shift * distanceFractionY;
        destinationY = destinationY - shortenBy * distanceFractionY - shift * distanceFractionX;

        return `M${originX},${originY}L${destinationX},${destinationY}`
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

    public getPersonColor(person: CirclePerson) {
        return person.protected ? 'orange' : (person.victim ? 'red' : '#cbd5e1')
    }

    public onPersonClicked(person: CirclePerson) {
        this.personClick.emit(person);
    }
}
