import { Action, Character } from "../../types";

export class Villager implements Character, Action {
    public Id = "villager";
    public IsSingle = false;

    IsAwakeThisNight = () => false;
}