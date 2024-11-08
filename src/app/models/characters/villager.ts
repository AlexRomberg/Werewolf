import { Action, Character } from "../../types";

export class Villager implements Character, Action {
    public Image = "villager";
    public Name = "Der Einfache Dorfbewohner";
    public IsSingle = false;

    IsAwakeThisNight = () => false;
}