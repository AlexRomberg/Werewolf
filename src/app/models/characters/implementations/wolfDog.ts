import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class WolfDog extends Character {
    Id = "wolf_dog";
    Group = GroupTypes.Wolves;
    Game = GameSets.Characters;
}