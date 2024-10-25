import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class PrimalWolf implements Role {
    public Priority = BasePriority.Wolf + 3;
    public Image = "primal_wolf";
    public Name = "Der Urwolf";
    public AssignedPerson?: CirclePerson | undefined;
    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [!role.AssignedPerson && "Person zuweisen", "Kann Opfer zu Werwolf machen"] },
            get buttons() {
                const buttons = [];
                if (!role.AssignedPerson) {
                    buttons.push(RequestAssignment(role))
                }

                // TODO: Add victim transformation
                return buttons;
            },
        }
    }

    IsAwakeThisNight = (night: number) => true; // TODO: Add dead wolf check
}