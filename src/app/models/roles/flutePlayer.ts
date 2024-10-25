import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class FlutePlayer implements Role {
    public Priority = BasePriority.PostWolf + 2;
    public Image = "flute_player";
    public Name = "Der Flötenspieler"
    public AssignedPerson: CirclePerson | undefined;
    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [!role.AssignedPerson && "Person zuweisen", "Kann eine Person verzaubern"] },
            get buttons() {
                const buttons = [];
                if (!role.AssignedPerson) {
                    buttons.push(RequestAssignment(role));
                }
                // TODO: Assign magic victim
                return buttons;
            }
        }
    }

    IsAwakeThisNight = () => true;
}