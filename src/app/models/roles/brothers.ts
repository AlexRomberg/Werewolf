import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignments } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Brothers implements Role {
    public Priority = BasePriority.Initial + 7;
    public Image = "brothers";
    public Name = "Die Drei Brüder"
    public AssignedPeople?: CirclePerson[] | undefined;
    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [role.AssignedPeople?.length !== 3 && "Personen zuweisen", "Dürfen sich untereinander austauschen"] },
            get buttons() {
                return role.AssignedPeople?.length === 3 ? [] : [RequestAssignments(role, 3)];
            }
        }
    }

    IsAwakeThisNight = (night: number) => night % 2 === 0;
}