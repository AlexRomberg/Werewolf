import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class BearGuide extends Character {
    Id = "bear_guide";
    Group = GroupTypes.Passive;
    Game = GameSets.Characters;
    override Priority = BasePriority.Initial + 9;

    override GetDescriptions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-bear_guide-2:Wenn dieser neben Werwolf sitzt oder infiziert ist, am Morgen das Dorf informieren`];
    override GetButtons = () => this.isAssigned ? [] : [RequestAssignment(this)];

    override IsAwakeThisNight = (round: number) => round <= 0;
}