import { GameSets, GroupTypes, iPerson } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Scapegoat extends Character {
    Id = "scapegoat";
    Group = GroupTypes.Passive;
    Game = GameSets.NewMoon;
    override Priority = BasePriority.Initial + 12;

    override GetDescriptions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-scapegoat-2:Kann direkt wieder schlafen gehen`,
        $localize`:@@character-action-scapegoat-3:Wird bei unentschieden in Abstimmungen gewählt`];
    override GetButtons = () => this.isAssigned ? [] : [RequestAssignment(this)];

    override IsAwakeThisNight = (round: number) => round <= 0;
}