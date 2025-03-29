import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class Wolfdog extends Character {
    readonly Id = "wolfdog";
    readonly Group = GroupTypes.Wolves;
    readonly Game = GameSets.Characters;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-wolfdog-general:In der ersten Nacht entscheidet der Wolfshund, auf welcher Seite er spielen möchte: als Einfacher Dorfbewohner oder lieber als Einfacher Werwolf. Entscheidet er sich für Letzteres, öffnet er einfach in der Wolfsphase mit allen anderen Wölfen die Augen und sucht mit ihnen ein Opfer. Ansonsten behält er die Augen geschlossen und spielt aufseiten des Dorfes. Diese Entscheidung ist endgültig und gilt für den Rest des Spiels. Ein Umentscheiden ist später nicht mehr möglich.` },
        { title: $localize`:@@character-description-hint-for-narrator:Tipp für den Spielleiter`, description: $localize`:@@character-description-wolfdog-hint-for-narrator:Ebenso wie beim Wilden Kind kann es die Spannung erhöhen, wenn die wahre Identität des Wolfshundes nicht verraten wird, sollte er durch die Wahl des Dorfes ausscheiden. So bleiben Zweifel, ob denn nun ein Dorfbewohner oder doch ein Werwolf eliminiert wurde.` }];
}