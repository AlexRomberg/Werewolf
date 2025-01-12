import { Action, Character } from "../../types";

export class OldMan implements Character, Action {
    public Id = "old_man";
    public IsSingle = true;

    IsAwakeThisNight = () => false;
}