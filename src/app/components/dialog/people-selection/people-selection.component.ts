import { Component, inject, input } from "@angular/core";
import { DialogService } from "../../../services/dialog.service";
import { StateService } from "../../../services/state.service";
import { CircleComponent } from "../../circle/circle.component";
import { Person } from "../../../models/state/person";

@Component({
    selector: "app-people-selection",
    imports: [CircleComponent],
    templateUrl: "./people-selection.component.html"
})
export class PeopleSelectionComponent {
    Dialog = inject(DialogService);
    GameState = inject(StateService);

    readonly PeopleDialog = input.required<{
        Title: string;
        People: Person[];
    }>();
}
