import { DialogService } from "../../../services/dialog.service";
import { GameStateService } from "../../../services/game-state.service";
import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Witch extends Character {
    Id = "witch";
    Group = GroupTypes.Active;
    Game = GameSets.BaseGame;
    override Priority = BasePriority.PostWolf + 1;
    private hasPositivePotion = true;
    private hasNegativePotion = true;

    override GetDescriptions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        (!this.hasPositivePotion && !this.hasNegativePotion) && $localize`:@@character-action-witch-2:Hat keinen Zaubertrank mehr.`,
        this.hasPositivePotion && $localize`:@@character-action-witch-3:Kann einen Heiltrank einsetzen`,
        this.hasNegativePotion && $localize`:@@character-action-witch-4:Kann einen Gifttrank einsetzen`
    ];
    override GetButtons = () => {
        const buttons = [];
        if (!this.isAssigned) {
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

    override IsAwakeThisNight = () => this.hasPositivePotion || this.hasNegativePotion;

    private async requstSave({ GameState, Dialog }: { GameState: GameStateService, Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleDialog($localize`:@@character-dialog-general-select-victim:Wähle das Opfer aus`, 1);
            const victims = GameState.People.filter(p => p.IsVictim);
            if (!victims.includes(people[0])) {
                if (!confirm($localize`:@@character-dialog-witch-1:Die Person ist kein Wolfsopfer. Trotzdem Heiltrank verwenden?`)) {
                    return;
                }
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
                if (!confirm($localize`:@@character-dialog-witch-2:Die Person ist bereits ein Wolfsopfer. Trotzdem Zaubertrank verwenden?`)) {
                    return;
                }
            }
            people[0].IsVictim = true;
            this.hasNegativePotion = false;
        } catch {
            // closed
        }
    }
}