import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CircleConnectionTypes, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Cupit implements Role, Action {
    public Priority = BasePriority.Initial + 3;
    public Image = "cupit";
    public Name = "Der Amor";
    public AssignedPerson: CirclePerson | undefined;
    private isDone = false;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", !this.isDone && "Muss ein Paar bestimmen", "Das Paar muss erwachen"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                title: "Paar zuweisen", action: this.RequestCouple.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = (night: number) => night === 0;

    private async RequestCouple({ gameState, dialog }: { gameState: GameStateService, dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Select couple", 2);
            gameState.Connections.push({
                type: CircleConnectionTypes.Love,
                from: people[0],
                to: people[1]
            });
            this.isDone = true;
        } catch {
            // closed
        }
    }
}