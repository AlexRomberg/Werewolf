import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class VillageIdiot extends Character {
    readonly Id = "village_idiot";
    readonly Group = GroupTypes.Passive;
    readonly Game = GameSets.NewMoon;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-village_idiot-general:Welches Dorf hat nicht seinen Dorfdeppen? Er macht ein wenig Unsinn, jedoch hat er ein so einnehmendes Wesen, dass ihm niemand etwas zuleide tun könnte. Wenn das Dorf gegen ihn stimmt, dreht der Dorfdepp seine Karte um. Augenblicklich erkennen die Dorfbewohner ihren Irrtum und begnadigen ihn sofort. Von nun an spielt er weiter, hat jedoch sein Stimmrecht verloren. Was zählt schon die Stimme eines Deppen. Es gibt keine neue Abstimmung in dieser Runde. Achtung: Wenn die Werwölfe ihn reissen, wird der Dorfdepp eliminiert. Wenn der Dorfdepp Hauptmann des Dorfes war, ist diese Rolle endgültig verloren. Wenn der Jäger auf den Dorfdeppen schiesst, scheidet der Dorfdepp aus.` }];
}