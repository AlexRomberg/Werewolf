import { Character } from "./character";

export class Villager extends Character {
    override name = "Villager";
    override description = "Bla bla villager";
    override id = "villager";
    public override hasMultiple = true;
}