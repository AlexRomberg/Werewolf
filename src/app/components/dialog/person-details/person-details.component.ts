import { Component, inject, input } from "@angular/core";
import { GameStateService } from "../../../services/game-state.service";
import { FormsModule } from "@angular/forms";
import { Person } from "../../../types";
import { DialogService } from "../../../services/dialog.service";

@Component({
    selector: "app-person-details",
    imports: [FormsModule],
    templateUrl: "./person-details.component.html"
})
export class PersonDetailsComponent {
    Dialog = inject(DialogService);
    GameState = inject(GameStateService);

    readonly Person = input.required<Person>();
}
