import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Scapegoat extends Character {
    readonly Id = "scapegoat";
    readonly Group = GroupTypes.Passive;
    readonly Game = GameSets.NewMoon;
    override readonly Priority = BasePriority.Initial + 12;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-scapegoat-general:Wenn die Abstimmung des Dorfes eine Stimmengleichheit ergibt, so scheidet der Sündenbock anstelle der beiden Charaktere mit gleicher Stimmenzahl aus. Es liegt bei ihm, so zu handeln, dass dieses traurige Ende verhindert wird. Wenn der Sündenbock ausscheidet, bleibt ihm ein Vorrecht, das er ausüben kann: Er bestimmt, wer am nächsten Tag abstimmen darf und wer nicht.` },
        { title: $localize`:@@character-description-attention:Achtung`, description: $localize`:@@character-description-scapegoat-attention:Wird nur 1 einziger Spieler bestimmt, der wählen darf, so riskiert man, dass er in der folgenden Nacht von den Werwölfen verschlungen wird. Somit gäbe es also keine Abstimmung im Dorf. (Es sei denn natürlich, der ausgewählte Spieler ist selbst ein Werwolf oder die Werwölfe verschlingen ihn absichtlich nicht.)` }];

    override GetActions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-scapegoat-2:Kann direkt wieder schlafen gehen`,
        $localize`:@@character-action-scapegoat-3:Wird bei unentschieden in Abstimmungen gewählt`];
    override GetButtons = () => this.isAssigned ? [] : [RequestAssignment(this)];

    override IsAwakeThisNight = (round: number) => round <= 0;
}