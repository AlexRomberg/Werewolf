import { Action, Character } from "../../types";

export class SmallChild implements Character, Action {
    public Id = "small_child";
    public IsSingle = true;

    IsAwakeThisNight = () => false;
}