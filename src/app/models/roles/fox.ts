import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Fox implements Role, Action {
    public Priority = BasePriority.Initial + 5;
    public Image = "fox";
    public Name = "Der Fuchs";
    public AssignedPerson: CirclePerson | undefined;
    private hasMisssed = false;

    GetPoints = () => [
        !this.AssignedPerson && "Person zuweisen",
        !this.hasMisssed && "Darf auf Person zeigen. Wenn diese / einer ihrer Nachbarn ein Werwolf ist, bestätigen",
        this.hasMisssed && "Hat keine Funktion mehr"
    ];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.hasMisssed) {
            buttons.push({
                title: "Hat verfehlt",
                action: () => {
                    this.hasMisssed = true;
                }
            });
        }
        return buttons;
    };
    IsAwakeThisNight = () => !this.hasMisssed;
}