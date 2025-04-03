import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Juggler extends Character {
    readonly Id = "juggler";
    readonly Group = GroupTypes.Passive;
    readonly Game = GameSets.Characters;
    override readonly Priority = BasePriority.Initial + 2;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-juggler-general:Vor der Partie wählt der Spielleiter drei Charaktere mit Spezialfähigkeiten, welche er, nach dem Verteilen der Rollen, aufgedeckt in die Mitte des Spielbereiches legt. Jede Nacht, nach Aufruf durch den Spielleiter, darf der Gaukler eine dieser Karten auswählen und den gewählten Charakter bis zur nächsten Nacht verkörpern. Wählt der Gaukler einen Charakter, so nimmt der Spielleiter diese Karte aus der Auswahl und entfernt sie aus dem Spiel.` },
        { title: $localize`:@@character-description-attention:Achtung`, description: $localize`:@@character-description-juggler-attention:Es darf kein Wolf für die Auslage gewählt werden.` },
        { title: $localize`:@@character-description-hint-for-narrator:Tipp für den Spielleiter`, description: $localize`:@@character-description-juggler-hint-for-narrator:Mit der Wahl der Karten, die du dem Gaukler anbietest, kannst du Einfluss auf das Spiel nehmen und ein wenig Chaos im Dorf verbreiten - oder auch helfen, einem sehr starken Wolfsrudel entgegen zu wirken. Wenn auch der Dieb im Spiel ist, müssen zuerst die beiden Karten für den Dieb bereitgelegt werden, erst danach die drei Karten für den Gaukler.` }];

    override GetActions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-juggler-2:Muss Rolle auswählen`];
    override GetButtons = () => this.isAssigned ? [] : [RequestAssignment(this)];

    override IsAwakeThisNight = () => true;
}