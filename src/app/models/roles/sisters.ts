import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignments } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Sisters implements Role, Action {
    public Priority = BasePriority.Initial + 6;
    public Image = "sisters";
    public Name = "Die Zwei Geschwister";
    public AssignedPeople?: CirclePerson[] | undefined;

    GetPoints = () => [this.AssignedPeople?.length !== 2 && "Personen zuweisen", "Dürfen sich untereinander austauschen"];
    GetButtons = () => this.AssignedPeople?.length == 2 ? [] : [RequestAssignments(this, 2)];
    IsAwakeThisNight = (night: number) => night % 2 === 0;
}