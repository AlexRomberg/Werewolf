import { Component, inject } from "@angular/core";
import { DialogService } from "../../services/dialog.service";
import { PeopleSelectionComponent } from "./people-selection/people-selection.component";
import { PersonDetailsComponent } from "./person-details/person-details.component";
import { DialogTypes } from "../../types";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { CharacterDetailsComponent } from "./character-details/character-details.component";
import { ChangesComponent } from "./changes/changes.component";

@Component({
    selector: "app-dialog",
    imports: [PeopleSelectionComponent, PersonDetailsComponent, CharacterDetailsComponent, ConfirmDialogComponent, ChangesComponent],
    templateUrl: "./dialog.component.html"
})
export class DialogComponent {
    Dialog = inject(DialogService);
    DialogTypes = DialogTypes
}
