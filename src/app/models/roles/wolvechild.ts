import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CircleConnectionTypes, CirclePerson } from "../../types";
import { Role } from "./roles";

export class Wolvechild implements Role {
    public Color = "orange";
    private assignedPerson: CirclePerson | undefined = undefined;
    private isDone = false;

    public Action: Action;

    constructor() {
        const wolfchild = this;

        this.Action = {
            title: "The Wolvechild",
            points: ["Needs to be assigned", "Needs a role model"],
            get buttons() {
                if (wolfchild.isDone) {
                    return []
                }
                return [(wolfchild.assignedPerson ? {
                    title: "Assign role model", action: wolfchild.RequstRolemodel.bind(wolfchild)
                } : {
                    title: "Assign person", action: wolfchild.RequstAssignment.bind(wolfchild)
                })]
            }
        }
    }

    private async RequstAssignment({ dialog }: { dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog(1, "Select person");
            people[0].role = this;
            this.assignedPerson = people[0];
        } catch {
            // closed
        }
    }

    private async RequstRolemodel({ gameState, dialog }: { gameState: GameStateService, dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog(1, "Select role model");
            gameState.Connections.push({
                type: CircleConnectionTypes.Trust,
                from: this.assignedPerson!,
                to: people[0]
            });
            this.isDone = true;
        } catch {
            // closed
        }
    }

    IsAwakeThisNight = (night: number) => night === 0;

}