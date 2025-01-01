import { Component, input } from "@angular/core";
import { DialogService } from "../../../services/dialog.service";
import { GameStateService } from "../../../services/game-state.service";
import { CircleComponent } from "../../circle/circle.component";
import { Person } from "../../../types";

@Component({
    selector: "app-people-selection",
    imports: [CircleComponent],
    templateUrl: "./people-selection.component.html"
})
export class PeopleSelectionComponent {
    readonly PeopleDialog = input.required<{
        Title: string;
        People: Person[];
    }>();
    constructor(public Dialog: DialogService, public GameState: GameStateService) { }
}
