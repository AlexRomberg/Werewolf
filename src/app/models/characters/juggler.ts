import { Action, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "../characters";

export class Juggler implements Character, Action {
    Priority = BasePriority.Initial + 2;
    Id = "juggler";
    IsSingle = true;
    AssignedPerson?: Person | undefined;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Muss Rolle auswählen"];
    GetButtons = () => this.AssignedPerson ? [] : [RequestAssignment(this)];
    IsAwakeThisNight = () => true;
}