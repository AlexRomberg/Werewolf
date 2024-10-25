import { DialogService } from "../../services/dialog.service";
import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";
import { SmallChild } from "./smallChild";

export class Healer implements Role, Action {
    public Priority = BasePriority.Initial + 10;
    public Image = "healer";
    public Name = "Der Heiler";
    public AssignedPerson?: CirclePerson | undefined;
    private lastProtectedPerson: CirclePerson | undefined;
    private isDone = false;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", !this.isDone && "Kann eine Person auswählen die unsterblich ist diese Nacht", this.isDone && "Ist fertig für diese Nacht"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                title: "Person schützen",
                action: this.RequestProtectedPerson.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = () => { this.isDone = false; return true; };

    private async RequestProtectedPerson({ dialog }: { dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Zu schützende Person auswählen", 1);
            if (people[0] === this.lastProtectedPerson) {
                if (!confirm("Es kann nicht zwei mal hinter einander die gleiche Person geschützt werden. Trotzdem fortfahren?")) {
                    return;
                }
            } else if (people[0].role instanceof SmallChild) {
                if (!confirm("Das kleine Mädchen kann nicht vor den Werwölfen geschützt werden. Trotzdem fortfahren?")) {
                    return;
                }
            }

            this.lastProtectedPerson = people[0];
            people[0].isProtected = true;
            this.isDone = true;
        } catch {
            // closed
        }
    }
}