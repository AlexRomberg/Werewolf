import { Role } from "./roles";

export class Villager implements Role {
    public Image = "villager";
    public Name = "Der Einfache Dorfbewohner"

    IsAwakeThisNight = () => false;
}