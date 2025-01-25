import { GameStateService } from "../../../services/game-state.service";
import { ActionButton, GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { BasePriority } from "../../../types";
import { WerewolfCharacter } from "../werewolfCharacter";

export class PrimalWolf extends WerewolfCharacter {
    Id = "primal_wolf";
    Group = GroupTypes.Wolves;
    Game = GameSets.Characters;
    override Priority = BasePriority.Wolf + 3;
    private isDone = false;

    override GetDescriptions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-primal_wolf-2:Kann Opfer zu Werwolf machen`];
    override GetButtons = () => {
        const buttons: ActionButton[] = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-primal_wolf-1:Opfer zu Werwolf verwandeln`,
                Action: this.requestVictimStateChangePerson.bind(this),
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = (_round: number, gameState: GameStateService) => !(this.isDone || gameState.People.some(p => p.IsDead && this.isWerewolf(p)));

    private async requestVictimStateChangePerson({ GameState }: { GameState: GameStateService }) {
        const victim = GameState.People.find(p => p.IsVictim);
        if (victim) {
            victim.IsVictim = false;
            victim.IsWerewolf = true;
            this.isDone = true;
        }
    }
}