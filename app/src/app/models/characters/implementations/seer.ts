import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Seer extends Character {
    readonly Id = "seer";
    readonly Group = GroupTypes.Active;
    readonly Game = GameSets.BaseGame;
    override readonly Priority = BasePriority.Initial + 4;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-seer-general:Jede Nacht erkennt sie die wahre Identität eines Spielers ihrer Wahl. Sie muss den anderen Dorfbewohnern helfen, dabei aber sehr bedacht vorgehen, da sie sonst von den Werwölfen entdeckt wird.` }];

    override GetActions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-seer-2:Darf sich eine Karte anschauen`];
    override GetButtons = () => this.isAssigned ? [] : [RequestAssignment(this)];

    override IsAwakeThisNight = () => true;
}