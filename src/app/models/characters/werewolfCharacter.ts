import { Person } from "../state/person";
import { Character } from "./character";

export abstract class WerewolfCharacter extends Character {
    protected isWerewolf(p: Person) {
        return p.Character instanceof WerewolfCharacter || p.IsWerewolf;
    }
}