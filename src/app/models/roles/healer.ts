import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Healer implements Role, Action {
    public Priority = BasePriority.Initial + 10;
    public Image = "healer";
    public Name = "Der Heiler"
    public AssignedPerson?: CirclePerson | undefined;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Kann eine Person auswählen die unsterblich ist diese Nacht"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        // TODO: Add protective action
        return buttons
    };
    IsAwakeThisNight = () => true;
}