import { GameSets, GroupTypes, iPerson } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Thief extends Character {
    Id = "thief";
    Group = GroupTypes.Active;
    Game = GameSets.BaseGame;
    override Priority = BasePriority.Initial + 1;

    override GetDescriptions = () => [
        $localize`:@@character-action-thief-1:Muss Karten tauschen`,
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`];
    override GetButtons = () => this.isAssigned ? [] : [RequestAssignment(this)];

    override IsAwakeThisNight = (round: number) => round === 0;
}