import { BasePriority, GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";

export class OldMan extends Character {
    Id = "old_man";
    Group = GroupTypes.Loners;
    Game = GameSets.NewMoon;
    override Priority = BasePriority.Initial + 13;


    override GetDescriptions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-old_man-2:Kann direkt wieder schlafen gehen`,
        $localize`:@@character-action-old_man-3:Ist Teil einer hälfte der Spieler und versucht die andere Hälfte umzubringen`];
    override GetButtons = () => this.isAssigned ? [] : [RequestAssignment(this)];

    override IsAwakeThisNight = (round: number) => round <= 0;
}