import { DialogService } from "../../../services/dialog.service";
import { StateService } from "../../../services/state.service";
import { ConnectionTypes, GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class WildChild extends Character {
    Id = "wild_child";
    Group = GroupTypes.Wolves;
    Game = GameSets.Characters;
    override Priority = BasePriority.Initial + 8;
    private get isDone() {
        return this.gameState.Connections.some(c => c.ConnectionType === ConnectionTypes.Trust);
    };

    override GetDescriptions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.isDone && $localize`:@@character-action-wild_child-2:Muss ein Vorbild wählen`,
        $localize`:@@character-action-wild_child-3:Wird zum Werwolf, wenn Vorbild stirbt`];
    override GetButtons = () => {
        const buttons = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        } else if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-wild_child-1:Vorbild zuweisen`, Action: this.requstRolemodel.bind(this)
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = (round: number) => round === 0;

    private async requstRolemodel({ GameState, Dialog }: { GameState: StateService, Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleDialog($localize`:@@character-dialog-wild_child-1:Wähle das Vorbild aus`, 1);
            GameState.addConnection(
                ConnectionTypes.Trust,
                this.gameState.getPeopleForCharacter(this)[0],
                people[0]
            );
        } catch {
            // closed
        }
    }
}