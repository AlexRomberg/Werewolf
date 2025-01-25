import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Seer extends Character {
    Id = "seer";
    Group = GroupTypes.Active;
    Game = GameSets.BaseGame;
    override Priority = BasePriority.Initial + 4;

    override GetDescriptions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-seer-2:Darf sich eine Karte anschauen`];
    override GetButtons = () => this.isAssigned ? [] : [RequestAssignment(this)];

    override IsAwakeThisNight = () => true;
}