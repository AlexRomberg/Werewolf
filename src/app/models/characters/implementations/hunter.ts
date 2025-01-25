import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class Hunter extends Character {
    Id = "hunter";
    Group = GroupTypes.Passive;
    Game = GameSets.BaseGame;
}