import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class FlutePlayer implements Role, Action {
    public Priority = BasePriority.PostWolf + 2;
    public Image = "flute_player";
    public Name = "Der Flötenspieler"
    public AssignedPerson: CirclePerson | undefined;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Kann eine Person verzaubern"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        // TODO: Assign magic victim
        return buttons;
    };
    IsAwakeThisNight = () => true;
}