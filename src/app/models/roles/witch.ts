import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Witch implements Role, Action {
    public Priority = BasePriority.PostWolf + 1;
    public Image = "witch";
    public Name = "Die Hexe";
    public AssignedPerson: CirclePerson | undefined;
    private hasPositivePotion = true;
    private hasNegativePotion = true;

    private async RequstSave({ gameState, dialog }: { gameState: GameStateService, dialog: DialogService }) {
        try {
            const victims = gameState.People.filter(p => p.victim);
            const people = await dialog.ShowPeopleDialog("Wähle das Opfer aus", 1);
            if (!victims.includes(people[0])) {
                return;
            }
            people[0].victim = false;
            this.hasPositivePotion = false;
        } catch {
            // closed
        }
    }

    private async RequstKill({ dialog }: { dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Wähle das Opfer aus", 1);
            if (people[0].victim) {
                return;
            }
            people[0].victim = true;
            this.hasNegativePotion = false;
        } catch {
            // closed
        }
    }


    GetPoints = () => [
        !this.AssignedPerson && "Person zuweisen",
        (!this.hasPositivePotion && !this.hasNegativePotion) && "Hat keinen Zaubertrank mehr.",
        this.hasPositivePotion && "Kann einen Heiltrank einsetzen",
        this.hasNegativePotion && "Kann einen Gifttrank einsetzen"
    ];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (this.hasPositivePotion) {
            buttons.push({ title: "Retten", action: this.RequstSave.bind(this) })
        }
        if (this.hasNegativePotion) {
            buttons.push({ title: "Person vergiften", action: this.RequstKill.bind(this) })
        }
        return buttons;
    };
    IsAwakeThisNight = () => this.hasPositivePotion || this.hasNegativePotion;
}