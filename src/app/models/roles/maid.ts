import { Action, Role } from "../../types";

export class Maid implements Role, Action {
    public Image = "maid";
    public Name = "Die Ergebene Magd";

    IsAwakeThisNight = () => false;
}