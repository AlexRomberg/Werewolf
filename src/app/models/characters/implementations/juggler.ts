import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Juggler extends Character {
    Id = "juggler";
    Group = GroupTypes.Passive;
    Game = GameSets.Characters;
    override Priority = BasePriority.Initial + 2;

    override GetDescriptions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-juggler-2:Muss Rolle auswählen`];
    override GetButtons = () => this.isAssigned ? [] : [RequestAssignment(this)];

    override IsAwakeThisNight = () => true;
}