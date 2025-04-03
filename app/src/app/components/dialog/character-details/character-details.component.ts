import { Component, inject } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { FormsModule } from "@angular/forms";
import { DialogService } from "../../../services/dialog.service";
import { I18nSelectPipe } from "@angular/common";
import { NAME_TRANSLATIONS } from "../../../i18n/translations";
import { DialogTypes } from "../../../types";
import { LucideAngularModule } from "lucide-angular";

@Component({
    selector: "app-character-details",
    imports: [FormsModule, I18nSelectPipe, LucideAngularModule],
    templateUrl: "./character-details.component.html",
    styleUrl: "./character-details.component.css"
})
export class CharacterDetailsComponent {
    Dialog = inject(DialogService);
    GameState = inject(StateService);
    NAME_TRANSLATIONS = NAME_TRANSLATIONS;
    DialogTypes = DialogTypes;
}
