import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Healer implements Role {
    public Priority = BasePriority.Initial + 10;
    public Image = "healer";
    public Name = "Der Heiler"
    public AssignedPerson?: CirclePerson | undefined;
    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [!role.AssignedPerson && "Person zuweisen", "Kann eine Person auswählen die unsterblich ist diese Nacht"] },
            get buttons() {
                const buttons = [];
                if (!role.AssignedPerson) {
                    buttons.push(RequestAssignment(role));
                }
                // TODO: Add protective action
                return buttons
            },
        }
    }

    IsAwakeThisNight = () => true;
}