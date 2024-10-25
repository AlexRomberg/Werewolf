import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Thief implements Role, Action {
    public Priority = BasePriority.Initial + 1;
    public Image = "thief";
    public Name = "Der Dieb";
    public AssignedPerson: CirclePerson | undefined;

    GetPoints = () => ["Muss Karten tauschen", !this.AssignedPerson && "Person zuweisen"];
    GetButtons = () => this.AssignedPerson ? [] : [RequestAssignment(this)];
    IsAwakeThisNight = (night: number) => night === 0;

}