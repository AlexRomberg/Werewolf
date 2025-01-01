import { Component } from "@angular/core";
import { DialogService } from "../../services/dialog.service";
import { PeopleSelectionComponent } from "./people-selection/people-selection.component";
import { PersonDetailsComponent } from "./person-details/person-details.component";

@Component({
    selector: "app-dialog",
    imports: [PeopleSelectionComponent, PersonDetailsComponent],
    templateUrl: "./dialog.component.html"
})
export class DialogComponent {
    constructor(public Dialog: DialogService) { }
}
