import { DialogService } from "../../../services/dialog.service";
import { StateService } from "../../../services/state.service";
import { ConnectionTypes, GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";
import { Person } from "../../state/person";

export class Bitch extends Character {
    Id = "bitch";
    Group = GroupTypes.Active;
    Game = GameSets.Special;
    override Priority = BasePriority.Initial + 11;
    private lastJoinedPerson: Person | undefined;
    private get isDone() {
        return this.gameState.Connections.some(c => c.ConnectionType === ConnectionTypes.Sleepover);
    };

    override GetDescriptions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.isDone && $localize`:@@character-action-bitch-2:Kann neues Zuhause suchen für die Nacht`,
        this.isDone && $localize`:@@character-action-bitch-3:Ist fertig für diese Nacht`];
    override GetButtons = () => {
        const buttons = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        } else if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-bitch-1:Gastgeber zuweisen`,
                Action: this.requestHostPerson.bind(this)
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = () => { return true; };
    override resetAfterNight = () => { this.gameState.removeConnection(ConnectionTypes.Sleepover) };

    private async requestHostPerson({ Dialog, GameState }: { Dialog: DialogService, GameState: StateService }) {
        try {
            const people = await Dialog.ShowPeopleSelectionDialog($localize`:@@character-dialog-bitch-1:Eine Person auswählen`, 1);
            if (people[0] === this.lastJoinedPerson) {
                if (!await Dialog.ShowConfirmDialog($localize`:@@character-dialog-bitch-2:Es darf nicht zwei mal hinter einander die gleiche Person gewählt werden. Trotzdem fortfahren?`)) {
                    return;
                }
            }

            this.lastJoinedPerson = people[0];
            GameState.addConnection(
                ConnectionTypes.Sleepover,
                this.gameState.getPeopleForCharacter(this)[0],
                people[0]
            );
        } catch {
            // closed
        }
    }
}