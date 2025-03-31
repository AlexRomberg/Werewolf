import { Component, inject } from "@angular/core";
import { DialogService } from "../../../services/dialog.service";
import { StateService } from "../../../services/state.service";
import { CircleComponent } from "../../circle/circle.component";
import { DialogTypes } from "../../../types";
import { Person } from "../../../models/state/person";
import { LucideAngularModule } from "lucide-angular";

@Component({
    selector: "app-people-selection",
    imports: [CircleComponent, LucideAngularModule],
    templateUrl: "./people-selection.component.html",
    styleUrl: "./people-selection.component.css"
})
export class PeopleSelectionComponent {
    Dialog = inject(DialogService);
    GameState = inject(StateService);
    DialogTypes = DialogTypes;

    OnPersonSelected(person: Person) {
        if (this.Dialog.DialogData?.type === DialogTypes.PeopleSelection && this.Dialog.DialogData.data.numberOfPeople === 1) {
            this.Dialog.DialogData.data.people.forEach(p => p.IsProtected = false);
        }
        person.IsProtected = !person.IsProtected
    }

    PeopleDialogSelectionValid() {
        if (this.Dialog.DialogData?.type !== DialogTypes.PeopleSelection || !this.Dialog.DialogData.data.numberOfPeople) {
            return true;
        }
        const selectedPeople = this.Dialog.DialogData.data.people.filter(p => p.IsProtected);

        return this.Dialog.DialogData.data.numberOfPeople === selectedPeople.length;
    };


    ConfirmDialog() {
        if (this.Dialog.DialogData?.type !== DialogTypes.PeopleSelection) {
            return;
        }

        this.Dialog.ConfirmDialog(this.Dialog.DialogData.data.people.filter(p => p.IsProtected));
    }
}
