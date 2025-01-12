import { DialogService } from "../../services/dialog.service";
import { Action, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "../characters";

export class FlutePlayer implements Character, Action {
    Priority = BasePriority.PostWolf + 2;
    Image = "flute_player";
    Name = "Der Flötenspieler";
    IsSingle = true;
    AssignedPerson: Person | undefined;
    private isDone = false;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Kann eine Person verzaubern"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: "Opfer markieren",
                Action: this.registerVictim.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = () => {
        this.isDone = false;
        return true;
    };

    private async registerVictim({ Dialog }: { Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleDialog("Wähle das Opfer aus", 1);
            people[0].IsEnchanted = true;
            this.isDone = true;
        } catch {
            // closed
        }
    }
}