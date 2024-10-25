import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Juggler implements Role {
    public Priority = BasePriority.Initial + 2;
    public Image = "juggler";
    public Name = "Der Gaukler"
    public AssignedPerson?: CirclePerson | undefined;
    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [!role.AssignedPerson && "Person zuweisen", "Muss Rolle auswählen"] },
            get buttons() {
                const buttons = [];
                if (!role.AssignedPerson) {
                    buttons.push(RequestAssignment(role))
                }
                return buttons
            },
        }
    }

    IsAwakeThisNight = (night: number) => true;
}