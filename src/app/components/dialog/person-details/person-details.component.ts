import { Component, input } from "@angular/core";
import { GameStateService } from "../../../services/game-state.service";
import { FormsModule } from "@angular/forms";
import { Person } from "../../../types";
import { DialogService } from "../../../services/dialog.service";

@Component({
    selector: "app-person-details",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./person-details.component.html"
})
export class PersonDetailsComponent {
    readonly Person = input.required<Person>();
    constructor(public Dialog: DialogService, public GameState: GameStateService) { }
}
