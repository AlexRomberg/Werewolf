import { DialogService } from "../../../services/dialog.service";
import { GameStateService } from "../../../services/game-state.service";
import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignments } from "../../actions/buttons";
import { BasePriority } from "../../../types";
import { WerewolfCharacter } from "../werewolfCharacter";

export class Werewolf extends WerewolfCharacter {
    Id = "werewolf";
    Game = GameSets.BaseGame;
    Group = GroupTypes.Wolves;
    override Priority = BasePriority.Wolf + 1;
    override IsSingle = false;
    private get isDone() {
        return this.gameState.People.some(p => p.IsVictim);
    };

    override GetDescriptions = () => [
        this.gameState.getPeopleForCharacter(this).length <= 0 && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.isDone && $localize`:@@character-action-werewolf-2:Müssen ein Opfer finden`];
    override GetButtons = () => {
        const buttons = [];
        if (this.gameState.getPeopleForCharacter(this).length <= 0) {
            buttons.push(RequestAssignments(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-werewolf-1:Opfer markieren`, Action: this.registerVictim.bind(this)
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = () => true;

    private async registerVictim({ Dialog, GameState }: { GameState: GameStateService, Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleDialog($localize`:@@character-dialog-general-select-victim:Wähle das Opfer aus`, 1);
            if (people[0].IsProtected) {
                return;
            }
            GameState.People.forEach(p => p.IsVictim = false);
            people[0].IsVictim = true;
        } catch {
            // closed
        }
    }
}