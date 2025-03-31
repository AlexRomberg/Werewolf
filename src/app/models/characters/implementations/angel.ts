import { GameSets, GroupTypes } from "../../../types";
import { Character } from "../character";

export class Angel extends Character {
    readonly Id = "angel";
    readonly Group = GroupTypes.Loners;
    readonly Game = GameSets.Characters;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-angel-general:Ist dieser Charakter im Spiel, so beginnt die erste Runde immer mit einem Tag und der dazugehörigen Abstimmung - noch bevor die erste Nacht anbricht und die Sondercharaktere das erste Mal aufgerufen werden. Gelingt es dem Engel, in dieser Abstimmung das Misstrauen des Dorfes auf sich zu ziehen oder während der ersten Nacht Ziel der verschlingenden Vergeltung der Lykanthropen zu werden und auf diese oder jene Weise auszuscheiden, so gewinnt er das Spiel. Der Spielleiter kann danach sofort ein neues Spiel beginnen. Passiert dies nicht, so wandelt sich der Engel in einen normalen Dorfbewohner, welchen er bis zum Ende des Spiels oder bis zu seinem Tode verkörpert.` },
        { title: $localize`:@@character-description-hint-for-narrator:Tipp für den Spielleiter`, description: $localize`:@@character-description-angel-hint-for-narrator:Zögern Sie nicht, am ersten Tag an die mögliche Anwesenheit des Engels zu erinnern! Die Diskussionen sind dann lebhafter, und die Schönredner werden durch diese himmlische Bedrohung geschützt.` }];
}