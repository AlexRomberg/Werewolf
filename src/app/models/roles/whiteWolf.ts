import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class WhiteWolf implements Role {
    public Priority = BasePriority.Wolf + 2;
    public Image = "white_wolf";
    public Name = "Der weisse Wolf";
    public AssignedPerson?: CirclePerson | undefined;
    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [!role.AssignedPerson && "Person zuweisen", "Kann einen Werwolf umbringen"] },
            get buttons() {
                const buttons = [];
                if (!role.AssignedPerson) {
                    buttons.push(RequestAssignment(role))
                }
                // TODO add victim method
                return buttons;
            },
        }
    }

    IsAwakeThisNight = (night: number) => night % 2 == 1;
}