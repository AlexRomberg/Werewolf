import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CardSelectionInformation } from "../../../types";

@Component({
    selector: "app-card",
    imports: [],
    templateUrl: "./card.component.html",
    styleUrl: "./card.component.css"
})
export class CardComponent {
    @Input()
    public Card?: CardSelectionInformation;

    @Output() SelectionChanged = new EventEmitter<boolean>();

    public SetCardSelectionState(state: boolean): void {
        this.SelectionChanged.emit(state);
    }
}
