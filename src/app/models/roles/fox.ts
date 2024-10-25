import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Fox implements Role {
    public Priority = BasePriority.Initial + 5;
    public Image = "fox";
    public Name = "Der Fuchs"
    public AssignedPerson: CirclePerson | undefined;
    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [!role.AssignedPerson && "Person zuweisen", "Darf auf Person zeigen. Wenn diese / einer ihrer Nachbarn ein Werwolf ist, bestätigen"] },
            get buttons() {
                const buttons = [];
                if (!role.AssignedPerson) {
                    buttons.push(RequestAssignment(role))
                }
                return buttons;
            },
        }
    }

    IsAwakeThisNight = () => true;
}