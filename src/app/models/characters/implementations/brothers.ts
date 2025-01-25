import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignments } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Brothers extends Character {
    Id = "brothers";
    Group = GroupTypes.Active;
    Game = GameSets.Characters;
    override Priority = BasePriority.Initial + 7;
    override IsSingle = false;

    override GetDescriptions = () => [
        this.gameState.getPeopleForCharacter(this).length !== 3 && $localize`:@@character-button-general-assing-people:Personen zuweisen`,
        $localize`:@@character-action-brothers-2:Dürfen sich untereinander austauschen`];
    override GetButtons = () => this.gameState.getPeopleForCharacter(this).length === 3 ? [] : [RequestAssignments(this, 3)];

    override IsAwakeThisNight = (round: number) => round % 2 === 0;
}