import { Action, CirclePerson } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority, Role } from "./roles";

export class Thief implements Role {
    public Priority = BasePriority.Initial + 1;
    public Image = "thief";
    public Name = "Der Dieb"
    public AssignedPerson: CirclePerson | undefined;

    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return ["Muss Karten tauschen", !role.AssignedPerson && "Person zuweisen"] },
            get buttons() {
                return role.AssignedPerson ? [] : [RequestAssignment(role)];
            }
        }
    }

    IsAwakeThisNight = (night: number) => night === 0;

}