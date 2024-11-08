import { Action, Character } from "../../types";

export class Angel implements Character, Action {
    Image = "angel";
    Name = "Der Engel";
    IsSingle = true;
    IsAwakeThisNight = () => false;
}