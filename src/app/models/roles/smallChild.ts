import { Action, Character } from "../../types";

export class SmallChild implements Character, Action {
    public Image = "small_child";
    public Name = "Das kleine Mädchen";
    public IsSingle = true;

    IsAwakeThisNight = () => false;
}