import { Component, EventEmitter, Input, Output } from "@angular/core";
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

    @Output() selectionChanged = new EventEmitter<boolean>();

    public SetCardSelectionState(state: boolean) {
        this.selectionChanged.emit(state);
    }
}
