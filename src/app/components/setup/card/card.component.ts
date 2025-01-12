import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CardSelectionInformation } from "../../../types";
import { I18nSelectPipe } from "@angular/common";
import { NAME_TRANSLATIONS } from "../../../models/characters";

@Component({
    selector: "app-card",
    imports: [I18nSelectPipe],
    templateUrl: "./card.component.html",
    styleUrl: "./card.component.css"
})
export class CardComponent {
    NAME_TRANSLATIONS = NAME_TRANSLATIONS;

    @Input()
    public Card?: CardSelectionInformation;

    @Output() SelectionChanged = new EventEmitter<boolean>();

    public SetCardSelectionState(state: boolean): void {
        this.SelectionChanged.emit(state);
    }
}
