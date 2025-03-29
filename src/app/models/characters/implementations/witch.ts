import { DialogService } from "../../../services/dialog.service";
import { StateService } from "../../../services/state.service";
import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Witch extends Character {
    readonly Id = "witch";
    readonly Group = GroupTypes.Active;
    readonly Game = GameSets.BaseGame;
    override readonly Priority = BasePriority.PostWolf + 1;
    override readonly Description = [{ title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-witch-general:Sie kann zwei sehr mächtige Zaubertränke brauen: Einen Heiltrank, um einen Spieler, der Opfer der Werwölfe wurde, vor dem Tod zu bewahren. Und ein Gift, um des Nachts einen beliebigen Spieler zu vergiften und somit ausscheiden zu lassen. Die Hexe kann diese Zaubertränke jeweils nur einmal im Verlauf einer Partie nutzen. Sie kann beide Zaubertränke in derselben Nacht einsetzen. Am Morgen, nachdem die Hexe ihre Fähigkeit eingesetzt hat, kann es demnach keinen, 1 oder auch 2 Tote geben (ohne Berücksichtigung der Fähigkeiten anderer Charaktere). Die Hexe kann den Heiltrank auch bei sich selbst anwenden, um sich zu heilen, wenn sie von den Werwölfen angegriffen wurde.` }];
    private hasPositivePotion = true;
    private hasNegativePotion = true;

    override GetActions = () => [
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

    private async requstSave({ GameState, Dialog }: { GameState: StateService, Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleSelectionDialog($localize`:@@character-dialog-general-select-victim:Wähle das Opfer aus`, 1);
            const victims = GameState.People.filter(p => p.IsVictim);
            if (!victims.includes(people[0])) {
                if (!await Dialog.ShowConfirmDialog($localize`:@@character-dialog-witch-1:Die Person ist kein Wolfsopfer. Trotzdem Heiltrank verwenden?`)) {
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
            const people = await Dialog.ShowPeopleSelectionDialog($localize`:@@character-dialog-general-select-victim:Wähle das Opfer aus`, 1);
            if (people[0].IsVictim) {
                if (!await Dialog.ShowConfirmDialog($localize`:@@character-dialog-witch-2:Die Person ist bereits ein Wolfsopfer. Trotzdem Zaubertrank verwenden?`)) {
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