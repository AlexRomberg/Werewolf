import { Action, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "../characters";

export class Seer implements Character, Action {
    public Priority = BasePriority.Initial + 4;
    public Id = "seer";
    public AssignedPerson?: Person | undefined;
    public IsSingle = true;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Darf sich eine Karte anschauen"];
    GetButtons = () => this.AssignedPerson ? [] : [RequestAssignment(this)];
    IsAwakeThisNight = () => true;

}