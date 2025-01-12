import { DialogService } from "../../services/dialog.service";
import { Action, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "../characters";

export class WhiteWolf implements Character, Action {
    public Priority = BasePriority.Wolf + 2;
    public Id = "white_wolf";
    public AssignedPerson?: Person | undefined;
    public IsSingle = true;
    private isDone = false;

    GetPoints = () => [
        !this.AssignedPerson && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-white_wolf-2:Kann einen Werwolf umbringen`];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
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
    IsAwakeThisNight = (night: number) => night % 2 == 1;

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