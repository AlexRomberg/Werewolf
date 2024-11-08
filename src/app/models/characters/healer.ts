import { DialogService } from "../../services/dialog.service";
import { Action, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";
import { SmallChild } from "./smallChild";

export class Healer implements Character, Action {
    Priority = BasePriority.Initial + 10;
    Image = "healer";
    Name = "Der Heiler";
    IsSingle = true;
    AssignedPerson?: Person | undefined;
    private lastProtectedPerson: Person | undefined;
    private isDone = false;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", !this.isDone && "Kann eine Person auswählen die unsterblich ist diese Nacht", this.isDone && "Ist fertig für diese Nacht"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: "Person schützen",
                Action: this.requestProtectedPerson.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = () => { this.isDone = false; return true; };

    private async requestProtectedPerson({ Dialog }: { Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleDialog("Zu schützende Person auswählen", 1);
            if (people[0] === this.lastProtectedPerson) {
                if (!confirm("Es kann nicht zwei mal hinter einander die gleiche Person geschützt werden. Trotzdem fortfahren?")) {
                    return;
                }
            } else if (people[0].Character instanceof SmallChild) {
                if (!confirm("Das kleine Mädchen kann nicht vor den Werwölfen geschützt werden. Trotzdem fortfahren?")) {
                    return;
                }
            }

            this.lastProtectedPerson = people[0];
            people[0].IsProtected = true;
            this.isDone = true;
        } catch {
            // closed
        }
    }
}