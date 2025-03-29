import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class OldMan extends Character {
    readonly Id = "old_man";
    readonly Group = GroupTypes.Passive;
    readonly Game = GameSets.Characters;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-old_man-general:Er hat siegreich all die furchtbaren Prüfungen des Lebens durchschritten und eine Widerstandskraft außerhalb des Gewöhnlichen erreicht. Die Werwölfe müssen sich zweimal für ihn entscheiden, um ihn zu verschlingen. Beim ersten Mal, sobald die Werwölfe den Alten des Dorfes reißen, überlebt er und der Spielleiter dreht seine Karte nicht um. Auch der Urwolf kann ihn nach dem ersten Biss nicht infizieren. Der Alte wird nur eliminiert, sobald er zweimal verschlungen wird. Die Abstimmung des Dorfes, der Gifttrank der Hexe, der Schuss des Jägers oder das Rasiermesser des Barbiers eliminieren den Alten jedoch schon beim ersten Mal. Allerdings verlieren die Dorfbewohner ihre besonderen Fähigkeiten aus Verzweiflung darüber, einen solch hoch gelehrten Mann getötet zu haben.` },
        { title: $localize`:@@character-description-attention:Achtung`, description: $localize`:@@character-description-old_man-attention:Wenn der Alte von der Hexe geheilt wird, gewinnt er nur ein einziges Leben.` },
        { title: ":@@character-description-variant-for-brave:Variante für Mutige", description: $localize`:@@character-description-old_man-variant-for-brave:Wenn der Dorfdepp bereits aufgedeckt ist, so scheidet er gemeinsam mit dem Alten aus, da das Dorf, welches nun seine Weisheit verloren hat, seine Entscheidung revidiert, den Dorfdeppen zu verschonen.` }];
}