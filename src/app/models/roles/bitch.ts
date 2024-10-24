import { Action, CirclePerson } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority, Role } from "./roles";

export class Bitch implements Role {
    public Priority = BasePriority.Initial + 11;
    public Image = "small_child";
    public Name = "Die Dorfmatratze";
    public AssignedPerson: CirclePerson | undefined;
    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [!role.AssignedPerson && "Person zuweisen", "Kann neues Zuhause suchen für die Nacht"] },
            get buttons() {
                return role.AssignedPerson ? [] : [RequestAssignment(role)]
                // TODO: Add sleep over function
            }
        }
    }

    IsAwakeThisNight = (night: number) => true;
}