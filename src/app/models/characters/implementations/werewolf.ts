import { DialogService } from "../../../services/dialog.service";
import { StateService } from "../../../services/state.service";
import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignments } from "../../actions/buttons";
import { BasePriority } from "../../../types";
import { WerewolfCharacter } from "../werewolfCharacter";

export class Werewolf extends WerewolfCharacter {
    readonly Id = "werewolf";
    readonly Game = GameSets.BaseGame;
    readonly Group = GroupTypes.Wolves;
    override readonly Priority = BasePriority.Wolf + 1;
    override readonly IsSingle = false;
    override readonly Description = [{ title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-werewolf-general:Jede Nacht frisst er einen Dorfbewohner. Tagsüber versucht er, seine wahre Identität zu verbergen. Ein Werwolf kann auf gar keinen Fall einen anderen Werwolf fressen.` }];
    private get isDone() {
        return this.gameState.People.some(p => p.IsVictim);
    };

    override GetActions = () => [
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

    private async registerVictim({ Dialog, GameState }: { GameState: StateService, Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleSelectionDialog($localize`:@@character-dialog-general-select-victim:Wähle das Opfer aus`, 1);
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