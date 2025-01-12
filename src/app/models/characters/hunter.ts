import { Action, Character } from "../../types";

export class Hunter implements Character, Action {
    Id = "hunter";
    IsSingle = true;

    IsAwakeThisNight = () => false;
}