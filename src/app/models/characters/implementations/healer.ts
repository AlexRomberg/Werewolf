import { DialogService } from "../../../services/dialog.service";
import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";
import { SmallChild } from "./smallChild";
import { Person } from "../../state/person";

export class Healer extends Character {
    Id = "healer";
    Group = GroupTypes.Active;
    Game = GameSets.NewMoon;
    override Priority = BasePriority.Initial + 10;
    private lastProtectedPerson: Person | undefined;
    private get isDone() {
        return this.gameState.People.some(p => p.IsProtected);
    };

    override GetDescriptions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.isDone && $localize`:@@character-action-healer-2:Kann eine Person auswählen die unsterblich ist diese Nacht`,
        this.isDone && $localize`:@@character-action-healer-3:Ist fertig für diese Nacht`];
    override GetButtons = () => {
        const buttons = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-healer-1:Person schützen`,
                Action: this.requestProtectedPerson.bind(this)
            });
        }
        return buttons;
    };
    override IsAwakeThisNight = () => { return true; };

    private async requestProtectedPerson({ Dialog }: { Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleSelectionDialog($localize`:@@character-dialog-healer-1:Zu schützende Person auswählen`, 1);
            if (people[0] === this.lastProtectedPerson) {
                if (!confirm($localize`:@@character-dialog-healer-2:Es kann nicht zwei mal hinter einander die gleiche Person geschützt werden. Trotzdem fortfahren?`)) {
                    return;
                }
            } else if (people[0].Character instanceof SmallChild) {
                if (!confirm($localize`:@@character-dialog-healer-3:Das kleine Mädchen kann nicht vor den Werwölfen geschützt werden. Trotzdem fortfahren?`)) {
                    return;
                }
            }

            this.lastProtectedPerson = people[0];
            people[0].IsProtected = true;
        } catch {
            // closed
        }
    }
}