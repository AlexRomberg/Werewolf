import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignments } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Brothers implements Role, Action {
    public Priority = BasePriority.Initial + 7;
    public Image = "brothers";
    public Name = "Die Drei Brüder"
    public AssignedPeople?: CirclePerson[] | undefined;

    GetPoints = () => [this.AssignedPeople?.length !== 3 && "Personen zuweisen", "Dürfen sich untereinander austauschen"];
    GetButtons = () => this.AssignedPeople?.length === 3 ? [] : [RequestAssignments(this, 3)];
    IsAwakeThisNight = (night: number) => night % 2 === 0;
}