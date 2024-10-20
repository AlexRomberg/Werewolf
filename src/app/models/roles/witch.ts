import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, ActionCallback, CirclePerson } from "../../types";
import { Role } from "./roles";

export class Witch implements Role {
    hasPositivePotion = true;
    hasNegativePotion = true;
    private assignedPerson: CirclePerson | undefined = undefined;

    public Color = "Yellow";
    public Action: Action;

    constructor() {
        const whitch = this;
        this.Action = {
            title: "🧙🏼‍♂️ The Witch",
            get points() {
                if (!whitch.hasPositivePotion && !whitch.hasNegativePotion) {
                    return ["Has no potions left"]
                }
                return [whitch.hasPositivePotion && "Has a saving potion", whitch.hasNegativePotion && "Has a killing potion"].filter(Boolean) as string[]
            },
            get buttons() {
                return [
                    !whitch.assignedPerson && { title: "Assign person", action: whitch.RequstAssignment.bind(whitch) },
                    whitch.hasPositivePotion && { title: "Save", action: whitch.RequstSave.bind(whitch) },
                    whitch.hasNegativePotion && { title: "Kill", action: whitch.RequstKill.bind(whitch) }
                ].filter(Boolean) as { title: string; action: ActionCallback }[]
            }
        }
    }

    IsAwakeThisNight = () => this.hasPositivePotion || this.hasNegativePotion;

    private async RequstAssignment({ dialog }: { dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Select person", 1);
            people[0].role = this;
            this.assignedPerson = people[0];
        } catch {
            // closed
        }
    }

    private async RequstSave({ gameState }: { gameState: GameStateService }) {
        const victim = gameState.People.find(p => p.victim);
        if (victim) {
            victim.victim = false;
            this.hasPositivePotion = false;
        }
    }

    private async RequstKill({ dialog }: { dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Select person", 1);
            people[0].victim = true;
            this.hasNegativePotion = false;
        } catch {
            // closed
        }
    }
}