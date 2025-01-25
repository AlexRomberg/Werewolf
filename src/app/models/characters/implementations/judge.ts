import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class Judge extends Character {
    Id = "judge";
    Group = GroupTypes.Passive;
    Game = GameSets.Characters;

    // TODO: This dude actually needs to wake up 😅
}