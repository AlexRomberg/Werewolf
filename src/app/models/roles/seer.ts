import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Seer implements Role, Action {
    public Priority = BasePriority.Initial + 4;
    public Image = "seer";
    public Name = "Die Seherin";
    public AssignedPerson?: CirclePerson | undefined;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Darf sich eine Karte anschauen"];
    GetButtons = () => this.AssignedPerson ? [] : [RequestAssignment(this)];
    IsAwakeThisNight = () => true;

}