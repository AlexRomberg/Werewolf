import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Thief extends Character {
    readonly Id = "thief";
    readonly Group = GroupTypes.Active;
    readonly Game = GameSets.BaseGame;
    override readonly Priority = BasePriority.Initial + 1;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-thief-general:Wenn mit dieser Karte gespielt werden soll, müssen zwei Einfache Dorfbewohner zusätzlich vor Beginn der Partie dem Spiel hinzugefügt werden. Nachdem die Karten verteilt wurden, werden die beiden übrigen Karten verdeckt in die Tischmitte gelegt. In der ersten Nacht sieht sich der Dieb die beiden Karten an und darf seine eigene gegen eine der beiden Karten austauschen. Wenn beide Karten in der Tischmitte Werwölfe sind, muss er seine Karte gegen eine der Werwolf-Karten eintauschen. Er behält die nun gewählte Identität bis zum Spielende bei.` }];

    override GetActions = () => [
        $localize`:@@character-action-thief-1:Muss Karten tauschen`,
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`];
    override GetButtons = () => this.isAssigned ? [] : [RequestAssignment(this)];

    override IsAwakeThisNight = (round: number) => round === 0;
}