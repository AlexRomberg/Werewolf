import { DialogService } from "../../../services/dialog.service";
import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { BasePriority } from "../../../types";
import { WerewolfCharacter } from "../werewolfCharacter";

export class WhiteWolf extends WerewolfCharacter {
    readonly Id = "white_wolf";
    readonly Group = GroupTypes.Wolves;
    readonly Game = GameSets.Characters;
    override readonly Priority = BasePriority.Wolf + 2;
    override readonly Description = [{ title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-white_wolf-general:Dieser bösartige Charakter verabscheut die Werwölfe ebenso wie die Dorfbewohner. Jede Nacht erwacht der Weisse Werwolf mit den Werwölfen und sucht sich mit ihnen ein Opfer unter den Dorfbewohnern. Doch jede zweite Nacht erwacht er, nach Aufruf durch den Spielleiter, alleine in einer eigenen Phase und darf, wenn er mag, einen Werwolf töten(jedoch keinen weiteren Dorfbewohner). Sein Ziel ist es, als einziger Überlebender im Dorf zu verbleiben. Nur in diesem Fall gewinnt er die Partie.` }];
    private isDone = false;

    override GetActions = () => [
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
            const people = await Dialog.ShowPeopleSelectionDialog($localize`:@@character-dialog-white_wolf-1:Wähle das Opfer (Werewolf) aus`, 1);
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