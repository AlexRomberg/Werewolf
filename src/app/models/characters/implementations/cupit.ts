import { DialogService } from "../../../services/dialog.service";
import { StateService } from "../../../services/state.service";
import { ConnectionTypes, GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Cupit extends Character {
    Id = "cupit";
    Group = GroupTypes.Active;
    Game = GameSets.BaseGame;
    override Priority = BasePriority.Initial + 3;
    private get isDone() {
        return this.gameState.Connections.some(c => c.ConnectionType === ConnectionTypes.Love);
    };

    override GetDescriptions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.isDone && $localize`:@@character-action-cupit-2:Muss ein Paar bestimmen`,
        $localize`:@@character-action-cupit-3:Das Paar muss erwachen`];
    override GetButtons = () => {
        const buttons = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-cupit-1:Paar zuweisen`, Action: this.requestCouple.bind(this)
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = (round: number) => round === 0;

    private async requestCouple({ GameState, Dialog }: { GameState: StateService, Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleDialog($localize`:@@character-dialog-cupit-1:Ein Paar auswählen`, 2);
            GameState.addConnection(
                ConnectionTypes.Love,
                people[0],
                people[1]
            );
        } catch {
            // closed
        }
    }
}