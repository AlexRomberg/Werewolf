import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class Angel extends Character {
    Id = "angel";
    Group = GroupTypes.Loners;
    Game = GameSets.Characters;
}