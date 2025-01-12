import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, Character, ConnectionTypes, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "../characters";

export class Cupit implements Character, Action {
    Priority = BasePriority.Initial + 3;
    Image = "cupit";
    Name = "Der Amor";
    IsSingle = true;
    AssignedPerson: Person | undefined;
    private isDone = false;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", !this.isDone && "Muss ein Paar bestimmen", "Das Paar muss erwachen"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: "Paar zuweisen", Action: this.requestCouple.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = (night: number) => night === 0;

    private async requestCouple({ GameState, Dialog }: { GameState: GameStateService, Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleDialog("Select couple", 2);
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