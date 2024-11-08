import { Action, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Fox implements Character, Action {
    Priority = BasePriority.Initial + 5;
    Image = "fox";
    Name = "Der Fuchs";
    IsSingle = true;
    AssignedPerson: Person | undefined;
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
                Title: "Hat verfehlt",
                Action: () => {
                    this.hasMisssed = true;
                }
            });
        }
        return buttons;
    };
    IsAwakeThisNight = () => !this.hasMisssed;
}