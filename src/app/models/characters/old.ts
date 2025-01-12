import { Action, Character } from "../../types";

export class Old implements Character, Action {
    public Id = "old";
    public IsSingle = true;

    IsAwakeThisNight = () => false;
}