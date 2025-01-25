import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class Old extends Character {
    Id = "old";
    Group = GroupTypes.Passive;
    Game = GameSets.Characters;
}