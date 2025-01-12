import { Action, Character } from "../../types";

export class Angel implements Character, Action {
    Id = "angel";
    IsSingle = true;
    IsAwakeThisNight = () => false;
}