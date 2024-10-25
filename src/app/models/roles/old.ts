import { Action, Role } from "../../types";

export class Old implements Role, Action {
    public Image = "old";
    public Name = "Der Alte"

    IsAwakeThisNight = () => false;
}