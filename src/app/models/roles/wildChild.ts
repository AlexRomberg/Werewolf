import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CircleConnectionTypes, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class WildChild implements Role {
    public Priority = BasePriority.Initial + 8;
    public Image = "wild_child";
    public Name = "Das wilde Kind";
    public AssignedPerson: CirclePerson | undefined;
    public Action: Action;
    private isDone = false;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [!role.AssignedPerson && "Person zuweisen", "Muss ein Vorbild wählen"] },
            get buttons() {
                const buttons = [];
                if (!role.AssignedPerson) {
                    buttons.push(RequestAssignment(role));
                } else if (!role.isDone) {
                    buttons.push({
                        title: "Vorbild zuweisen", action: role.RequstRolemodel.bind(role)
                    });
                }
                return buttons;
            }
        }
    }

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

    IsAwakeThisNight = (night: number) => night === 0;

}