import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Fox extends Character {
    readonly Id = "fox";
    readonly Group = GroupTypes.Active;
    readonly Game = GameSets.Characters;
    override readonly Priority = BasePriority.Initial + 5;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-fox-general:In der Nacht, durch Aufruf des Spielleiters, erwacht der Fuchs und darf eine Gruppe dreier Nachbarn wählen, indem er auf die mittlere Person zeigt. Findet sich in dieser Gruppe mindestens ein Werwolf, zeigt ihm der Spielleiter dies an. In diesem Fall darf der Fuchs seine Fähigkeit in der folgenden Nacht erneut anwenden. Sollte sich kein Werwolf in der gewählten Gruppe befinden, verliert der Fuchs seine Kräfte. Jedoch besitzt er nun die wertvolle Information, welche drei Spieler über jeden Verdacht erhaben sind.` },
        { title: ":@@character-description-hint:Hinweis", description: $localize`:@@character-description-fox-hint:Der Spielleiter ruft den Fuchs zwar in jeder Nacht auf, doch dieser muss seine Sonderfähigkeit nicht jede Nacht nutzen.` },
        { title: $localize`:@@character-description-hint-for-narrator:Tipp für den Spielleiter`, description: $localize`:@@character-description-fox-hint-for-narrator:Dem Fuchs werden nicht die Karten der gewählten Spieler gezeigt, er erhält lediglich die Information, ob sich (mindestens) ein Werwolf unter ihnen befindet oder nicht.` }];
    private hasMisssed = false;

    override GetActions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.hasMisssed && this.gameState.Round > 0 && $localize`:@@character-action-fox-2:Darf auf Person zeigen. Wenn diese / einer ihrer Nachbarn ein Werwolf ist, bestätigen`,
        this.hasMisssed && $localize`:@@character-action-fox-3:Hat keine Funktion mehr in dieser Nacht`
    ];
    override GetButtons = () => {
        const buttons = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.hasMisssed && this.gameState.Round > 0) {
            buttons.push({
                Title: $localize`:@@character-button-fox-1:Hat verfehlt`,
                Action: () => {
                    this.hasMisssed = true;
                }
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = () => !this.hasMisssed;
}