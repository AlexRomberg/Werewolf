import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "../characters";

export class Witch implements Character, Action {
    public Priority = BasePriority.PostWolf + 1;
    public Id = "witch";
    public AssignedPerson: Person | undefined;
    public IsSingle = true;
    private hasPositivePotion = true;
    private hasNegativePotion = true;

    GetPoints = () => [
        !this.AssignedPerson && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        (!this.hasPositivePotion && !this.hasNegativePotion) && $localize`:@@character-action-witch-2:Hat keinen Zaubertrank mehr.`,
        this.hasPositivePotion && $localize`:@@character-action-witch-3:Kann einen Heiltrank einsetzen`,
        this.hasNegativePotion && $localize`:@@character-action-witch-4:Kann einen Gifttrank einsetzen`
    ];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (this.hasPositivePotion) {
            buttons.push({ Title: $localize`:@@character-button-witch-1:Retten`, Action: this.requstSave.bind(this) });
        }
        if (this.hasNegativePotion) {
            buttons.push({ Title: $localize`:@@character-button-witch-2:Person vergiften`, Action: this.requstKill.bind(this) });
        }
        return buttons;
    };
    IsAwakeThisNight = () => this.hasPositivePotion || this.hasNegativePotion;

    private async requstSave({ GameState, Dialog }: { GameState: GameStateService, Dialog: DialogService }) {
        try {
            const victims = GameState.People.filter(p => p.IsVictim);
            const people = await Dialog.ShowPeopleDialog($localize`:@@character-dialog-general-select-victim:Wähle das Opfer aus`, 1);
            if (!victims.includes(people[0])) {
                return;
            }
            people[0].IsVictim = false;
            this.hasPositivePotion = false;
        } catch {
            // closed
        }
    }

    private async requstKill({ Dialog }: { Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleDialog($localize`:@@character-dialog-general-select-victim:Wähle das Opfer aus`, 1);
            if (people[0].IsVictim) {
                return;
            }
            people[0].IsVictim = true;
            this.hasNegativePotion = false;
        } catch {
            // closed
        }
    }
}