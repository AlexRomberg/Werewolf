import { Action, Character } from "../../types";

export class OldMan implements Character, Action {
    public Image = "old_man";
    public Name = "Der Verbitterte Greis";
    public IsSingle = true;

    IsAwakeThisNight = () => false;
}