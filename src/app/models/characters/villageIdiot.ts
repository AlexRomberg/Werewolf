import { Action, Character } from "../../types";

export class VillageIdiot implements Character, Action {
    public Image = "village_idiot";
    public Name = "Der Dorfdepp";
    public IsSingle = true;

    IsAwakeThisNight = () => false;
}