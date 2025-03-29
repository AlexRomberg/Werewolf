import { DialogService } from "../../../services/dialog.service";
import { StateService } from "../../../services/state.service";
import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { BasePriority } from "../../../types";
import { WerewolfCharacter } from "../werewolfCharacter";

export class BigWolf extends WerewolfCharacter {
    readonly Id = "big_wolf";
    readonly Group = GroupTypes.Wolves;
    readonly Game = GameSets.Characters;
    override readonly Priority = BasePriority.Wolf + 4;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-big_wolf-general:Jede Nacht erwacht der Große, böse Wolf mit den anderen Wölfen und sucht sich ein Opfer. Doch solange kein Werwolf, das Wilde Kind (als Wolf) oder der Wolfshund (als Wolf) eliminiert wurde, erwacht er direkt im Anschluss an die Wolfsphase erneut, aber alleine, und sucht sich ein weiteres Opfer. Er darf keinen Werwolf fressen.` }];
    private isDone = false;

    override GetActions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.isDone && $localize`:@@character-action-big_wolf-2:Kann zweites Opfer definieren`];
    override GetButtons = () => {
        const buttons = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-big_wolf-1:Zweites Opfer markieren`,
                Action: this.registerVictim.bind(this)
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = (_round: number, gameState: StateService) => {
        return !gameState.People.some(p => p.IsDead && this.isWerewolf(p));
    };

    override resetAfterNight = () => this.isDone = false;

    private async registerVictim({ Dialog }: { Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleSelectionDialog($localize`:@@character-dialog-big_wolf-1:Wähle das zweite Opfer (kein Werwolf) aus`, 1);
            if (people[0].IsProtected || people[0].IsVictim) {
                return;
            }
            people[0].IsVictim = true;
            this.isDone = true;
        } catch {
            // closed
        }
    }
}