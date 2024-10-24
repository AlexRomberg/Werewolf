import { Action, CirclePerson } from "../../types";
import { RequestAssignments } from "../actions/buttons";
import { BasePriority, Role } from "./roles";

export class Sisters implements Role {
    public Priority = BasePriority.Initial + 6;
    public Image = "sisters";
    public Name = "Die Zwei Geschwister"
    public AssignedPeople?: CirclePerson[] | undefined;
    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [role.AssignedPeople?.length !== 2 && "Personen zuweisen", "Dürfen sich untereinander austauschen"] },
            get buttons() {
                return role.AssignedPeople?.length == 2 ? [] : [RequestAssignments(role, 2)];
            },
        }
    }

    IsAwakeThisNight = (night: number) => night % 2 === 0;
}