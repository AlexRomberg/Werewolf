import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class Knight extends Character {
    Id = "knight";
    Group = GroupTypes.Passive;
    Game = GameSets.Characters;
}