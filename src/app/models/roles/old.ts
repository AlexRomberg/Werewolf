import { Action, Character } from "../../types";

export class Old implements Character, Action {
    public Image = "old";
    public Name = "Der Alte";
    public IsSingle = true;

    IsAwakeThisNight = () => false;
}