import { Component, Input } from "@angular/core";
import { CardSelectionInformation } from "../../../types";

@Component({
    selector: "app-card",
    standalone: true,
    imports: [],
    templateUrl: "./card.component.html",
    styleUrl: "./card.component.css"
})
export class CardComponent {
    @Input()
    public Card?: CardSelectionInformation;
}
