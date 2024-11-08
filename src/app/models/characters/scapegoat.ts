import { Action, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Scapegoat implements Character, Action {
    public Priority = BasePriority.Initial + 12;
    public Image = "scapegoat";
    public Name = "Der Sündenbock";
    public AssignedPerson?: Person | undefined;
    public IsSingle = true;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Kann direkt wieder schlafen gehen", "Wird bei unentschieden in Abstimmungen gewählt"];
    GetButtons = () => this.AssignedPerson ? [] : [RequestAssignment(this)];
    IsAwakeThisNight = (night: number) => night <= 0;
}