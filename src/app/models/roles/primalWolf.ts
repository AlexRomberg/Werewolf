import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class PrimalWolf implements Role, Action {
    public Priority = BasePriority.Wolf + 3;
    public Image = "primal_wolf";
    public Name = "Der Urwolf";
    public AssignedPerson?: CirclePerson | undefined;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Kann Opfer zu Werwolf machen"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this))
        }
        // TODO: Add victim transformation
        return buttons;
    };
    IsAwakeThisNight = (night: number) => true; // TODO: Add dead wolf check
}