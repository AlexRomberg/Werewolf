import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignments } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Sisters extends Character {
    readonly Id = "sisters";
    readonly Group = GroupTypes.Active;
    readonly Game = GameSets.Characters;
    override readonly Priority = BasePriority.Initial + 6;
    override readonly IsSingle = false;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-sisters-general:Die Zwei Schwestern sind vom selben Schlag wie die anderen Dorfbewohner und ziehen am selben Strang. Der Spielleiter ruft in der ersten Nacht die Zwei Schwestern auf, damit diese einander erkennen. In erfahrenen Spielrunden können die Schwestern von Zeit zu Zeit (jede zweite Runde oder nach Gusto des Spielleiters) des Nachts wieder aufgerufen werden, um sich schnell und leise auf ein gemeinsames Vorgehen zur Rettung des Dorfes zu einigen.` },
        { title: $localize`:@@character-description-hint-for-narrator:Tipp für den Spielleiter`, description: $localize`:@@character-description-sisters-hint-for-narrator:Die Zwei Schwestern sind ein mächtiges Instrument in Händen von Spielern, welche die Gebärdensprache beherrschen.` }];

    override GetActions = () => [
        this.gameState.getPeopleForCharacter(this).length !== 2 && $localize`:@@character-button-general-assing-people:Personen zuweisen`,
        $localize`:@@character-action-sisters-2:Dürfen sich untereinander austauschen`];
    override GetButtons = () => this.gameState.getPeopleForCharacter(this).length == 2 ? [] : [RequestAssignments(this, 2)];

    override IsAwakeThisNight = (night: number) => night % 2 === 0;
}