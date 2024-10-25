import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class BearGuide implements Role, Action {
    Priority = BasePriority.Initial + 9;
    Image = "bear_guide";
    Name = "Der Bärenführer";
    AssignedPerson: CirclePerson | undefined

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Wenn dieser neben Werwolf sitzt / infiziert ist am Morgen das Dorf informieren"];
    GetButtons = () => this.AssignedPerson ? [] : [RequestAssignment(this)];
    IsAwakeThisNight = (night: number) => night <= 0;
}