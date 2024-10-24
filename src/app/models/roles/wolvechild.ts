import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CircleConnectionTypes, CirclePerson } from "../../types";
import { Role } from "./roles";

export class WildChild implements Role {
    public Image = "wild_child";
    public Name = "The wild child";
    private assignedPerson: CirclePerson | undefined = undefined;
    private isDone = false;

    public Action: Action;

    constructor() {
        const wildChild = this;

        this.Action = {
            title: wildChild.Name,
            points: ["Needs to be assigned", "Needs a role model"],
            get buttons() {
                if (wildChild.isDone) {
                    return []
                }
                return [(wildChild.assignedPerson ? {
                    title: "Assign role model", action: wildChild.RequstRolemodel.bind(wildChild)
                } : {
                    title: "Assign person", action: wildChild.RequstAssignment.bind(wildChild)
                })]
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

    private async RequstRolemodel({ gameState, dialog }: { gameState: GameStateService, dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Select role model", 1);
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