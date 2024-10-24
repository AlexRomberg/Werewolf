import { Action, CirclePerson } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority, Role } from "./roles";

export class Scapegoat implements Role {
    public Priority = BasePriority.Initial + 12;
    public Image = "scapegoat";
    public Name = "Der Sündenbock"
    public AssignedPerson?: CirclePerson | undefined;
    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [!role.AssignedPerson && "Person zuweisen", "Kann direkt wieder schlafen gehen", "Wird bei unentschieden in Abstimmungen gewählt"] },
            get buttons() {
                const buttons = [];
                if (!role.AssignedPerson) {
                    buttons.push(RequestAssignment(role))
                }
                return buttons;
            },
        }
    }

    IsAwakeThisNight = (night: number) => night <= 0;
}