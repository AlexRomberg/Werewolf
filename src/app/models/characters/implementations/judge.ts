import { BasePriority, GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";

export class Judge extends Character {
    readonly Id = "judge";
    readonly Group = GroupTypes.Passive;
    readonly Game = GameSets.Characters;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-judge-general:Einmal im Spiel darf der Richter entscheiden, dass am Tage eine weitere Abstimmung des Dorfes mit einem zweiten Opfer stattfindet. Dies lässt er den Spielleiter durch ein vorher abgestimmtes, spezielles Zeichen während der ersten Wahl der Bewohner wissen. Diese zweite Abstimmung folgt direkt nach der ersten – ohne weitere Diskussion. Der \"St-t-t- otternde Ri-ri-richter\" vereinbart dieses Zeichen mit dem Spielleiter, während er in der ersten Nacht aufgerufen wird.` },
        { title: $localize`:@@character-description-hint-for-narrator:Tipp für den Spielleiter`, description: $localize`:@@character-description-judge-hint-for-narrator:Beobachte den Stotternden Richter stets genau, um sein Zeichen nicht zu übersehen.` }];
    override readonly Priority = BasePriority.Initial + 14;

    override GetActions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-judge-2:Muss Zeichen mit Spielleiter vereinbaren`,
        $localize`:@@character-action-judge-3:Kann eine zweite Abstimmung anfordern indem er das Zeichen macht`,];
    override GetButtons = () => this.isAssigned ? [] : [RequestAssignment(this)];

    override IsAwakeThisNight = (round: number) => round <= 0;
}