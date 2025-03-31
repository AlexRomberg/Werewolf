import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class SmallChild extends Character {
    readonly Id = "small_child";
    readonly Group = GroupTypes.Active;
    readonly Game = GameSets.BaseGame;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-small_child-general:Das Kleine Mädchen darf die Werwölfe während ihrer Wachphase mit halbgeöffneten Augen ausspionieren. Wenn es aber dabei von den Werwölfen erwischt wird, darf es sofort (geräuschlos) anstelle des ursprünglich vorgesehenen Opfers aufgefressen werden und scheidet aus. Das Mädchen kann nur nachts während der Wachphase der Werwölfe spionieren. Auf keinen Fall darf es sich als Werwolf ausgeben und die Augen weit öffnen.` }];
}