import { Point } from "../../types";

export class CircleShared {
    GetIndexCoordinate(index: number, amount: number) {
        const angle = 2 * Math.PI / amount * index
        return this.GetCoordinateByAngle(angle);
    }

    protected GetCoordinateByAngle(angle: number) {
        const center = 1000, distance = 700
        return {
            x: center + Math.sin(angle) * distance,
            y: center - Math.cos(angle) * distance
        };
    }

    protected computeEndpoints(fromIndex: number, toIndex: number, amountOfPeople: number, shortenBy: number, offset: number) {
        let origin = this.GetIndexCoordinate(fromIndex, amountOfPeople);
        let destination = this.GetIndexCoordinate(toIndex, amountOfPeople);

        const distanceX = destination.x - origin.x;
        const distanceY = destination.y - origin.y;

        const length = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const distanceFractionX = distanceX / length;
        const distanceFractionY = distanceY / length;

        origin.x = origin.x + shortenBy * distanceFractionX + offset * distanceFractionY;
        origin.y = origin.y + shortenBy * distanceFractionY - offset * distanceFractionX;
        destination.x = destination.x - shortenBy * distanceFractionX + offset * distanceFractionY;
        destination.y = destination.y - shortenBy * distanceFractionY - offset * distanceFractionX;
        return { origin, destination };
    }

    protected GetPathDescription(fromIndex: number, toIndex: number, amountOfPeople: number, offset: number, shortenBy = 150) {
        if (fromIndex < toIndex) {
            const temp = fromIndex;
            fromIndex = toIndex;
            toIndex = temp;
        }
        let { destination, origin } = this.computeEndpoints(fromIndex, toIndex, amountOfPeople, shortenBy, offset);

        return `M${origin.x},${origin.y}L${destination.x},${destination.y}`;
    }
}