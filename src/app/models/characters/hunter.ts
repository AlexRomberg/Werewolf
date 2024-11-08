import { Action, Character } from "../../types";

export class Hunter implements Character, Action {
    Image = "hunter";
    Name = "Der Jäger";
    IsSingle = true;

    IsAwakeThisNight = () => false;
}