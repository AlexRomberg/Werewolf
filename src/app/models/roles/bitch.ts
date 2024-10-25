import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Bitch implements Role, Action {
    public Priority = BasePriority.Initial + 11;
    public Image = "small_child";
    public Name = "Die Dorfmatratze";
    public AssignedPerson: CirclePerson | undefined;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Kann neues Zuhause suchen für die Nacht"];
    GetButtons = () => this.AssignedPerson ? [] : [RequestAssignment(this)]; // TODO: Add sleep over function
    IsAwakeThisNight = () => true;
}