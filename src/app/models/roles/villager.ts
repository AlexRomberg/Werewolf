import { Action, Role } from "../../types";

export class Villager implements Role, Action {
    public Image = "villager";
    public Name = "Der Einfache Dorfbewohner";

    IsAwakeThisNight = () => false;
}