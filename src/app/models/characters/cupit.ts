import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, Character, ConnectionTypes, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "../characters";

export class Cupit implements Character, Action {
    Priority = BasePriority.Initial + 3;
    Id = "cupit";
    IsSingle = true;
    AssignedPerson: Person | undefined;
    private isDone = false;

    GetPoints = () => [
        !this.AssignedPerson && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.isDone && $localize`:@@character-action-cupit-2:Muss ein Paar bestimmen`,
        $localize`:@@character-action-cupit-3:Das Paar muss erwachen`];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-cupit-1:Paar zuweisen`, Action: this.requestCouple.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = (night: number) => night === 0;

    private async requestCouple({ GameState, Dialog }: { GameState: GameStateService, Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleDialog($localize`:@@character-dialog-cupit-1:Ein Paar auswählen`, 2);
            GameState.Connections.push({
                Type: ConnectionTypes.Love,
                From: people[0],
                To: people[1]
            });
            this.isDone = true;
        } catch {
            // closed
        }
    }
}