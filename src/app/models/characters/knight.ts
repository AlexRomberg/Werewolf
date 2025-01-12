import { Action, Character } from "../../types";

export class Knight implements Character, Action {
    public Id = "knight";
    public IsSingle = true;

    IsAwakeThisNight = () => false;
}