import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class Villager extends Character {
    readonly Id = "villager";
    readonly Group = GroupTypes.Passive;
    readonly Game = GameSets.BaseGame;
    override readonly IsSingle = false;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-villager-general:Er hat keine besonderen Fähigkeiten. Seine einzigen Waffen sind sein scharfer Sinn für verdächtiges Verhalten und die Fähigkeit, die anderen von seiner Unschuld zu überzeugen.` }];
}