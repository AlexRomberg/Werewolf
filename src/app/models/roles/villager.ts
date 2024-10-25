import { Role } from "../../types";

export class Villager implements Role {
    public Image = "villager";
    public Name = "Der Einfache Dorfbewohner"

    IsAwakeThisNight = () => false;
}