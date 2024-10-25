import { Action, Role } from "../../types";

export class OldMan implements Role, Action {
    public Image = "old_man";
    public Name = "Der Verbitterte Greis"

    IsAwakeThisNight = () => false;
}