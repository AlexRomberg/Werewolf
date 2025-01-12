import { Action, Character } from "../../types";

export class Maid implements Character, Action {
    public Id = "maid";
    public IsSingle = true;

    IsAwakeThisNight = () => false;
}