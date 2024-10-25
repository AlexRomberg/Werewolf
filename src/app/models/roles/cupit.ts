import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CircleConnectionTypes, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Cupit implements Role {
    public Priority = BasePriority.Initial + 3;
    public Image = "cupit";
    public Name = "Der Amor"
    public AssignedPerson: CirclePerson | undefined;
    private isDone = false;
    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [!role.AssignedPerson && "Person zuweisen", !role.isDone && "Muss ein Paar bestimmen", "Das Paar muss erwachen"] },
            get buttons() {
                const buttons = [];
                if (!role.AssignedPerson) {
                    buttons.push(RequestAssignment(role));
                }
                if (!role.isDone) {
                    buttons.push({
                        title: "Paar zuweisen", action: role.RequestCouple.bind(role)
                    });
                }
                return buttons;
            }
        }
    }

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

    IsAwakeThisNight = (night: number) => night === 0;
}