import { Component, inject, input } from "@angular/core";
import { GameStateService } from "../../../services/game-state.service";
import { FormsModule } from "@angular/forms";
import { Person } from "../../../types";
import { DialogService } from "../../../services/dialog.service";
import { I18nSelectPipe } from "@angular/common";
import { NAME_TRANSLATIONS } from "../../../models/characters";

@Component({
    selector: "app-person-details",
    imports: [FormsModule, I18nSelectPipe],
    templateUrl: "./person-details.component.html"
})
export class PersonDetailsComponent {
    Dialog = inject(DialogService);
    GameState = inject(GameStateService);
    NAME_TRANSLATIONS = NAME_TRANSLATIONS;

    readonly Person = input.required<Person>();
}
