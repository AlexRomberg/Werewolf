import { Action, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "../characters";

export class Fox implements Character, Action {
    Priority = BasePriority.Initial + 5;
    Id = "fox";
    IsSingle = true;
    AssignedPerson: Person | undefined;
    private hasMisssed = false;

    GetPoints = () => [
        !this.AssignedPerson && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.hasMisssed && $localize`:@@character-action-fox-2:Darf auf Person zeigen. Wenn diese / einer ihrer Nachbarn ein Werwolf ist, bestätigen`,
        this.hasMisssed && $localize`:@@character-action-fox-3:Hat keine Funktion mehr`
    ];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.hasMisssed) {
            buttons.push({
                Title: $localize`:@@character-button-fox-1:Hat verfehlt`,
                Action: () => {
                    this.hasMisssed = true;
                }
            });
        }
        return buttons;
    };
    IsAwakeThisNight = () => !this.hasMisssed;
}