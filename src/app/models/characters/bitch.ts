import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, Character, ConnectionTypes, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "../characters";

export class Bitch implements Character, Action {
    Priority = BasePriority.Initial + 11;
    Id = "bitch";
    IsSingle = true;
    AssignedPerson: Person | undefined;
    private lastJoinedPerson: Person | undefined;
    private isDone = false;

    GetPoints = () => [
        !this.AssignedPerson && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.isDone && $localize`:@@character-action-bitch-2:Kann neues Zuhause suchen für die Nacht`,
        this.isDone && $localize`:@@character-action-bitch-3:Ist fertig für diese Nacht`];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        } else if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-bitch-1:Gastgeber zuweisen`,
                Action: this.requestHostPerson.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = () => { this.isDone = false; return true; };

    private async requestHostPerson({ Dialog, GameState }: { Dialog: DialogService, GameState: GameStateService }) {
        try {
            const people = await Dialog.ShowPeopleDialog($localize`:@@character-dialog-bitch-1:Eine Person auswählen`, 1);
            if (people[0] === this.lastJoinedPerson) {
                if (!confirm($localize`:@@character-dialog-bitch-2:Es darf nicht zwei mal hinter einander die gleiche Person gewählt werden. Trotzdem fortfahren?`)) {
                    return;
                }
            }

            this.lastJoinedPerson = people[0];
            GameState.Connections.push({ Type: ConnectionTypes.Sleepover, From: this.AssignedPerson!, To: people[0] });
            this.isDone = true;
        } catch {
            // closed
        }
    }
}