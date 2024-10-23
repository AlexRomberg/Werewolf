import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, ActionCallback, CirclePerson } from "../../types";
import { Role } from "./roles";

export class Witch implements Role {
    hasPositivePotion = true;
    hasNegativePotion = true;
    private assignedPerson: CirclePerson | undefined = undefined;

    public Color = "Yellow";
    public Name = "Witch";
    public Action: Action;

    constructor() {
        const witch = this;
        this.Action = {
            title: "🧙🏼‍♂️ The Witch",
            get points() {
                return [
                    !witch.assignedPerson && "Needs to be assigned",
                    (!witch.hasPositivePotion && !witch.hasNegativePotion) && "Has no potions left",
                    witch.hasPositivePotion && "Has a saving potion",
                    witch.hasNegativePotion && "Has a killing potion"
                ]
            },
            get buttons() {
                const buttons = [];
                if (!witch.assignedPerson) {
                    buttons.push({ title: "Assign person", action: witch.RequstAssignment.bind(witch) });
                }
                if (witch.hasPositivePotion) {
                    buttons.push({ title: "Save", action: witch.RequstSave.bind(witch) })
                }
                if (witch.hasNegativePotion) {
                    buttons.push({ title: "Kill", action: witch.RequstKill.bind(witch) })
                }
                return buttons;
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