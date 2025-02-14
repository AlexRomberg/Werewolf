import { DialogService } from "../../../services/dialog.service";
import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class FlutePlayer extends Character {
    Id = "flute_player";
    Group = GroupTypes.Loners;
    Game = GameSets.NewMoon;
    override Priority = BasePriority.PostWolf + 2;
    private get isDone() {
        return this.gameState.People.some(p => p.IsEnchanted);
    };

    override GetDescriptions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-flute_player-2:Kann eine Person verzaubern`];
    override GetButtons = () => {
        const buttons = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-flute_player-1:Opfer markieren`,
                Action: this.registerVictim.bind(this)
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = () => {
        return true;
    };

    private async registerVictim({ Dialog }: { Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleSelectionDialog($localize`:@@character-dialog-flute_player-1:Wähle das Opfer aus`, 1);
            people[0].IsEnchanted = true;
        } catch {
            // closed
        }
    }
}