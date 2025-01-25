import { DialogService } from "../../../services/dialog.service";
import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { BasePriority } from "../../../types";
import { WerewolfCharacter } from "../werewolfCharacter";

export class WhiteWolf extends WerewolfCharacter {
    Id = "white_wolf";
    Group = GroupTypes.Wolves;
    Game = GameSets.Characters;
    override Priority = BasePriority.Wolf + 2;
    private isDone = false;

    override GetDescriptions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.isDone && $localize`:@@character-action-white_wolf-2:Kann einen Werwolf umbringen`];
    override GetButtons = () => {
        const buttons = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-white_wolf-1:Zweites Opfer markieren`,
                Action: this.registerVictim.bind(this)
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = (round: number) => round % 2 == 1;

    override resetAfterNight = () => this.isDone = false;

    private async registerVictim({ Dialog }: { Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleDialog($localize`:@@character-dialog-white_wolf-1:Wähle das Opfer (Werewolf) aus`, 1);
            if (people[0].IsProtected) {
                return;
            }
            people[0].IsVictim = true;
            this.isDone = true;
        } catch {
            // closed
        }
    }
}