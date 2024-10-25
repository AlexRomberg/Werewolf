import { Action, Role } from "../../types";

export class Knight implements Role, Action {
    public Image = "knight";
    public Name = "Der Ritter der rostigen Klinge";

    IsAwakeThisNight = () => false;
}