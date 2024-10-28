import { DialogService } from "../../services/dialog.service";
import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class WhiteWolf implements Role, Action {
    public Priority = BasePriority.Wolf + 2;
    public Image = "white_wolf";
    public Name = "Der weisse Wolf";
    public AssignedPerson?: CirclePerson | undefined;
    private isDone = false;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Kann einen Werwolf umbringen"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                title: "Zweites Opfer markieren",
                action: this.RegisterVictim.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = (night: number) => night % 2 == 1;

    private async RegisterVictim({ dialog }: { dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Wähle das Opfer (Werewolf) aus", 1);
            if (people[0].isProtected) {
                return;
            }
            people[0].isVictim = true;
            this.isDone = true;
        } catch {
            // closed
        }
    }
}