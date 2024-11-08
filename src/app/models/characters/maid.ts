import { Action, Character } from "../../types";

export class Maid implements Character, Action {
    public Image = "maid";
    public Name = "Die Ergebene Magd";
    public IsSingle = true;

    IsAwakeThisNight = () => false;
}