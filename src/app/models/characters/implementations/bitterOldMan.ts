import { BasePriority, GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";

export class BitterOldMan extends Character {
    readonly Id = "bitter_old_man";
    readonly Group = GroupTypes.Loners;
    readonly Game = GameSets.NewMoon;
    override readonly Priority = BasePriority.Initial + 13;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-bitter_old_man-general:Vor Anfang der Partie teilt der Spielleiter das Dorf in zwei Gruppen und verkündet dies laut. Dabei erfolgt die Einteilung aufgrund von offensichtlichen Kriterien (Geschlecht, Brille, Größe, Alter, Bart, etc.). Der Verbitterte Greis muss einer der beiden Gruppen eindeutig zugeordnet werden können. Das Ziel dieses Charakters ist es, alle Spieler der jeweils anderen Gruppe zu eliminieren. In diesem Falle, und nur in diesem Falle, gewinnt er das Spiel ganz allein. Er besitzt dazu keine Sonderfähigkeit – das Wort und seine Fähigkeit zu manipulieren sind seine einzigen Waffen.` },
        { title: $localize`:@@character-description-hint-for-narrator:Tipp für den Spielleiter`, description: $localize`:@@character-description-bitter_old_man-hint-for-narrator:Es ist nicht notwendig, dass beide Gruppen gleich groß sind. Zögere im Zweifel nicht, alle Spieler darauf hinzuweisen, welcher Gruppe sie zugehörig sind.` }];


    override GetActions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-bitter_old_man-2:Kann direkt wieder schlafen gehen`,
        $localize`:@@character-action-bitter_old_man-3:Ist Teil einer hälfte der Spieler und versucht die andere Hälfte umzubringen`];
    override GetButtons = () => this.isAssigned ? [] : [RequestAssignment(this)];

    override IsAwakeThisNight = (round: number) => round <= 0;
}