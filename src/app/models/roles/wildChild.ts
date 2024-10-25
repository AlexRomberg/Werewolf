import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CircleConnectionTypes, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class WildChild implements Role, Action {
    public Priority = BasePriority.Initial + 8;
    public Image = "wild_child";
    public Name = "Das wilde Kind";
    public AssignedPerson: CirclePerson | undefined;
    private isDone = false;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", !this.isDone && "Muss ein Vorbild wählen", "Wird zum Werwolf, wenn Vorbild stirbt"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        } else if (!this.isDone) {
            buttons.push({
                title: "Vorbild zuweisen", action: this.RequstRolemodel.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = (night: number) => night === 0;

    private async RequstRolemodel({ gameState, dialog }: { gameState: GameStateService, dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Wähle das Vorbild aus", 1);
            gameState.Connections.push({
                type: CircleConnectionTypes.Trust,
                from: this.AssignedPerson!,
                to: people[0]
            });
            this.isDone = true;
        } catch {
            // closed
        }
    }
}