import { GameSets, GroupTypes, iPerson } from "../../../types";
import { RequestAssignments } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Sisters extends Character {
    Id = "sisters";
    Group = GroupTypes.Active;
    Game = GameSets.Characters;
    override Priority = BasePriority.Initial + 6;
    override IsSingle = false;

    override GetDescriptions = () => [
        this.gameState.getPeopleForCharacter(this).length !== 2 && $localize`:@@character-button-general-assing-people:Personen zuweisen`,
        $localize`:@@character-action-sisters-2:Dürfen sich untereinander austauschen`];
    override GetButtons = () => this.gameState.getPeopleForCharacter(this).length == 2 ? [] : [RequestAssignments(this, 2)];

    override IsAwakeThisNight = (night: number) => night % 2 === 0;
}