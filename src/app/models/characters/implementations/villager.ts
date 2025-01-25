import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class Villager extends Character {
    Id = "villager";
    Group = GroupTypes.Passive;
    Game = GameSets.BaseGame;
    override IsSingle = false;
}