import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class Hunter extends Character {
    readonly Id = "hunter";
    readonly Group = GroupTypes.Passive;
    readonly Game = GameSets.BaseGame;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-hunter-general:Wenn er von den Werwölfen verschlungen oder von den Dorfbewohnern hingerichtet wird, darf er sich vor seinem Ableben wehren und einen beliebigen Spieler bestimmen, der ebenfalls ausscheidet.` },
        { title: ":@@character-description-special-case:Sonderfall", description: $localize`:@@character-description-hunter-special-case:Wenn der Jäger in einen Spieler verliebt ist, der aus der Partie ausscheidet, kann er vor seinem eigenen Ausscheiden sofort einen anderen Spieler seiner Wahl benennen, der ebenfalls ausscheidet. Das kann dazu führen, dass kein einziger Spieler überlebt. In diesem Fall hat keines der Lager gewonnen.` }];
}