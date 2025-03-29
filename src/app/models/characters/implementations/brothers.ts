import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignments } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Brothers extends Character {
    readonly Id = "brothers";
    readonly Group = GroupTypes.Active;
    readonly Game = GameSets.Characters;
    override readonly Priority = BasePriority.Initial + 7;
    override readonly IsSingle = false;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-brothers-general:Die Drei Brüder sind vom selben Schlag wie die anderen Dorfbewohner und ziehen am selben Strang. In der ersten Nacht, nach Aufruf durch den Spielleiter, erwachen die Brüder, um sich gegenseitig kennenzulernen. Der Spielleiter kann in erfahrenen Runden die Drei Brüder von Zeit zu Zeit (jede zweite Runde oder je nach Belieben) wecken, um ihnen eine schnelle und leise Absprache des weiteren Vorgehens zu ermöglichen.` },
        { title: $localize`:@@character-description-hint-for-narrator:Tipp für den Spielleiter`, description: $localize`:@@character-description-brothers-hint-for-narrator:Ebenso wie die Zwei Schwestern sind die Drei Brüder ein mächtiges Instrument in Händen von Spielern, welche die Gebärdensprache beherrschen. Sie sollten nur in grossen Spielrunden eingesetzt werden. In sehr grossen Runden ist es empfehlenswert, auch die Zwei Schwestern hinzuzunehmen.` }];

    override GetActions = () => [
        this.gameState.getPeopleForCharacter(this).length !== 3 && $localize`:@@character-button-general-assing-people:Personen zuweisen`,
        $localize`:@@character-action-brothers-2:Dürfen sich untereinander austauschen`];
    override GetButtons = () => this.gameState.getPeopleForCharacter(this).length === 3 ? [] : [RequestAssignments(this, 3)];

    override IsAwakeThisNight = (round: number) => round % 2 === 0;
}