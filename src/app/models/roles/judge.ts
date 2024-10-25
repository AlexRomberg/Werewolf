import { Action, Role } from "../../types";

export class Judge implements Role, Action {
    public Image = "judge";
    public Name = "Der Richter";

    IsAwakeThisNight = () => false;
}