import { Component, OnInit } from '@angular/core';
import { CircleConnection, CircleConnectionTypes, CirclePerson } from '../../types';
import { GameStateService } from '../../services/game-state.service';

@Component({
    selector: 'app-circle',
    standalone: true,
    imports: [],
    templateUrl: './circle.component.html',
    styleUrl: './circle.component.css'
})
export class CircleComponent {

    constructor(public state: GameStateService) { }


    public getCoordinateX(index: number) {
        return 1000 + Math.sin(2 * Math.PI / this.state.People.length * index) * 875;
    }

    public getCoordinateY(index: number) {
        return 1000 - Math.cos(2 * Math.PI / this.state.People.length * index) * 875;
    }

    private getOtherConnections(connection: CircleConnection, index: number) {
        return this.state.Connections.reduce((prev, curr, idx) => {
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
        let originX = this.getCoordinateX(this.state.Connections[index].from);
        let originY = this.getCoordinateY(this.state.Connections[index].from);
        let destinationX = this.getCoordinateX(this.state.Connections[index].to);
        let destinationY = this.getCoordinateY(this.state.Connections[index].to);

        let distanceX = destinationX - originX;
        let distanceY = destinationY - originY;
        let shortenBy = 150;

        let length = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        let distanceFractionX = distanceX / length;
        let distanceFractionY = distanceY / length;
        const { before, all } = this.getOtherConnections(this.state.Connections[index], index)
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
        return person.protected ? 'orange' : '#cbd5e1'
    }
}
