import { DialogService } from "../../services/dialog.service";
import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class FlutePlayer implements Role, Action {
    Priority = BasePriority.PostWolf + 2;
    Image = "flute_player";
    Name = "Der Flötenspieler";
    AssignedPerson: CirclePerson | undefined;
    private isDone = false;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Kann eine Person verzaubern"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                title: "Opfer markieren",
                action: this.RegisterVictim.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = () => {
        this.isDone = false;
        return true;
    };

    private async RegisterVictim({ dialog }: { dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Wähle das Opfer aus", 1);
            people[0].isEnchanted = true;
            this.isDone = true;
        } catch {
            // closed
        }
    }
}