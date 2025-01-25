import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class SmallChild extends Character {
    Id = "small_child";
    Group = GroupTypes.Active;
    Game = GameSets.BaseGame;
}