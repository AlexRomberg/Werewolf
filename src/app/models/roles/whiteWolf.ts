import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class WhiteWolf implements Role, Action {
    public Priority = BasePriority.Wolf + 2;
    public Image = "white_wolf";
    public Name = "Der weisse Wolf";
    public AssignedPerson?: CirclePerson | undefined;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Kann einen Werwolf umbringen"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        // TODO add victim method
        return buttons;
    };
    IsAwakeThisNight = (night: number) => night % 2 == 1;
}