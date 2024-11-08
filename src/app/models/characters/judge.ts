import { Action, Character } from "../../types";

export class Judge implements Character, Action {
    Image = "judge";
    Name = "Der Richter";
    IsSingle = true;

    IsAwakeThisNight = () => false;
}