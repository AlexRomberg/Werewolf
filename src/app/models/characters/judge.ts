import { Action, Character } from "../../types";

export class Judge implements Character, Action {
    Id = "judge";
    IsSingle = true;

    IsAwakeThisNight = () => false;
}