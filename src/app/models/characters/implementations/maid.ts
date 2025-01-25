import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class Maid extends Character {
    public Id = "maid";
    Group = GroupTypes.Passive;
    Game = GameSets.Characters;
}