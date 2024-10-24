import { Action, CirclePerson } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority, Role } from "./roles";

export class BearGuide implements Role {
    public Priority = BasePriority.Initial + 9;
    public Image = "bear_guide";
    public Name = "Der Bärenführer";
    public AssignedPerson: CirclePerson | undefined
    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [!role.AssignedPerson && "Person zuweisen", "Wenn dieser neben Werwolf sitzt / infiziert ist am Morgen das Dorf informieren"] },
            get buttons() {
                return role.AssignedPerson ? [] : [RequestAssignment(role)]
            }
        }
    }

    IsAwakeThisNight = (night: number) => night <= 0;
}