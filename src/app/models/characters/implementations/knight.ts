import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class Knight extends Character {
    readonly Id = "knight";
    readonly Group = GroupTypes.Passive;
    readonly Game = GameSets.Characters;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-knight-general:Wird der Ritter gefressen, so scheidet er aus dem Spiel aus – jedoch erleidet ein Wolf durch die verrostete Klinge eine Vergiftung. Von den schuldigen Wölfen erliegt in der folgenden Nacht jener seiner tödlichen Wunde, welcher dem Ritter links am nächsten sass, nachdem er, trotz seiner Verletzung, einen ganzen Tag lang überlebte. Der Tod des Wolfes durch die Vergiftung wird am Morgen, nach der Nacht des Hinscheidens vom Spielleiter bekannt gegeben.` },
        { title: ":@@character-description-hint:Hinweis", description: $localize`:@@character-description-knight-hint:Clevere Spieler können nun daraus folgern, dass alle Spieler die zwischen dem “Ritter der rostigen Klinge” und dem erkrankten Werwolf sitzen, unschuldige Dorfbewohner sind.` }];
}