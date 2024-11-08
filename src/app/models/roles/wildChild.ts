import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, Character, ConnectionTypes, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class WildChild implements Character, Action {
    public Priority = BasePriority.Initial + 8;
    public Image = "wild_child";
    public Name = "Das wilde Kind";
    public AssignedPerson: Person | undefined;
    public IsSingle = true;
    private isDone = false;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", !this.isDone && "Muss ein Vorbild wählen", "Wird zum Werwolf, wenn Vorbild stirbt"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        } else if (!this.isDone) {
            buttons.push({
                Title: "Vorbild zuweisen", Action: this.requstRolemodel.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = (night: number) => night === 0;

    private async requstRolemodel({ GameState, Dialog }: { GameState: GameStateService, Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleDialog("Wähle das Vorbild aus", 1);
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