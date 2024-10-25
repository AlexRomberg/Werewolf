import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Seer implements Role {
    public Priority = BasePriority.Initial + 4;
    public Image = "seer";
    public Name = "Die Seherin";
    public AssignedPerson?: CirclePerson | undefined;
    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [!role.AssignedPerson && "Person zuweisen", "Darf sich eine Karte anschauen"] },
            get buttons() {
                return role.AssignedPerson ? [] : [RequestAssignment(role)]
            }
        }
    }

    IsAwakeThisNight = () => true;

}