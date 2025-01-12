import { Action, Character } from "../../types";

export class VillageIdiot implements Character, Action {
    public Id = "village_idiot";
    public IsSingle = true;

    IsAwakeThisNight = () => false;
}