import { Action, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "../characters";

export class BearGuide implements Character, Action {
    Priority = BasePriority.Initial + 9;
    Id = "bear_guide";
    IsSingle = true;
    AssignedPerson: Person | undefined;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Wenn dieser neben Werwolf sitzt oder infiziert ist, am Morgen das Dorf informieren"];
    GetButtons = () => this.AssignedPerson ? [] : [RequestAssignment(this)];
    IsAwakeThisNight = (night: number) => night <= 0;
}