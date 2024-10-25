import { Action, Role } from "../../types";

export class Hunter implements Role, Action {
    public Image = "hunter";
    public Name = "Der Jäger";

    IsAwakeThisNight = () => false;
}