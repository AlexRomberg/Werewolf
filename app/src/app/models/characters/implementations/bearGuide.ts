import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class BearGuide extends Character {
    readonly Id = "bear_guide";
    readonly Group = GroupTypes.Passive;
    readonly Game = GameSets.Characters;
    override readonly Priority = BasePriority.Initial + 9;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-bear_guide-general:Jeden Morgen, direkt nach der Verkündung der nächtlichen Opfer, brummt der Spielleiter wie ein Bär, sollte einer der direkten Nachbarn des Bärenführers ein Werwolf sein. Dabei werden nur Nachbarn berücksichtigt, die noch im Spiel sind.` },
        { title: $localize`:@@character-description-hint-for-narrator:Tipp für den Spielleiter`, description: $localize`:@@character-description-bear_guide-hint-for-narrator:Es vereinfacht das Spiel, wenn ausgeschiedene Spieler nicht weiter in der Runde der aktiven Spieler sitzen bleiben. Ist der Bärenführer selbst vom Urwolf infiziert, brummst du jede Runde, solange bis der Bärenführer ausgeschieden ist.` }];

    override GetActions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-bear_guide-2:Wenn dieser neben Werwolf sitzt oder infiziert ist, am Morgen das Dorf informieren`];
    override GetButtons = () => this.isAssigned ? [] : [RequestAssignment(this)];

    override IsAwakeThisNight = (round: number) => round <= 0;
}