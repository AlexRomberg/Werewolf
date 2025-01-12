import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, Character, ConnectionTypes, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "../characters";

export class WildChild implements Character, Action {
    public Priority = BasePriority.Initial + 8;
    public Id = "wild_child";
    public AssignedPerson: Person | undefined;
    public IsSingle = true;
    private isDone = false;

    GetPoints = () => [
        !this.AssignedPerson && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.isDone && $localize`:@@character-action-wild_child-2:Muss ein Vorbild wählen`,
        $localize`:@@character-action-wild_child-3:Wird zum Werwolf, wenn Vorbild stirbt`];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        } else if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-wild_child-1:Vorbild zuweisen`, Action: this.requstRolemodel.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = (night: number) => night === 0;

    private async requstRolemodel({ GameState, Dialog }: { GameState: GameStateService, Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleDialog($localize`:@@character-dialog-wild_child-1:Wähle das Vorbild aus`, 1);
            GameState.Connections.push({
                Type: ConnectionTypes.Trust,
                From: this.AssignedPerson!,
                To: people[0]
            });
            this.isDone = true;
        } catch {
            // closed
        }
    }
}