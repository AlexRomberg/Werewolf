import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CircleConnectionTypes, CirclePerson } from "../../types";
import { Role } from "./roles";

export class Cupit implements Role {
    public Color = "pink";
    private assignedPerson: CirclePerson | undefined = undefined;
    private isDone = false;

    public Action: Action;

    constructor() {
        const cupit = this;

        this.Action = {
            title: "💘 The Cupit",
            get points() { return [!cupit.assignedPerson && "Needs to be assigned", !cupit.isDone && "Needs to define a couple", "Couple needs to wake up"] },
            get buttons() {
                const buttons = [];
                if (!cupit.assignedPerson) {
                    buttons.push({
                        title: "Assign person", action: cupit.RequstAssignment.bind(cupit)
                    });
                }
                if (!cupit.isDone) {
                    buttons.push({
                        title: "Assign couple", action: cupit.RequestCouple.bind(cupit)
                    });
                }
                return buttons;
            }
        }
    }

    private async RequstAssignment({ dialog }: { dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Select person", 1);
            people[0].role = this;
            this.assignedPerson = people[0];
        } catch {
            // closed
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