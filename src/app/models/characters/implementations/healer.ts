import { DialogService } from "../../../services/dialog.service";
import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";
import { SmallChild } from "./smallChild";
import { Person } from "../../state/person";

export class Healer extends Character {
    readonly Id = "healer";
    readonly Group = GroupTypes.Active;
    readonly Game = GameSets.NewMoon;
    override readonly Priority = BasePriority.Initial + 10;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-healer-general:Wenn der Heiler nachts vor den Werwölfen aufgerufen wird, zeigt er dem Spielleiter einen Spieler. Der so bestimmte Spieler wird in dieser Nacht (und nur in dieser Nacht) gegen die Werwölfe geschützt sein. Wenn er von ihnen als Opfer ausgewählt wird, scheidet er nicht aus dem Spiel aus.` },
        { title: $localize`:@@character-description-attention:Achtung`, description: $localize`:@@character-description-healer-attention:Der Heiler hat das Recht, sich selbst zu schützen. Der Heiler darf nicht in zwei aufeinanderfolgenden Nächten denselben Spieler schützen. Der Schutz des Heilers hat keinerlei Auswirkung auf das Kleine Mädchen. (Sie befindet sich derzeit in einer totalen Pubertätskrise und es gibt nichts, was sie davon abhalten könnte, Ärger zu suchen.) Der Heiler kann weder vor dem Flötenspieler noch vor der Infektion durch den Urwolf schützen.` }];

    private lastProtectedPerson: Person | undefined;
    private get isDone() {
        return this.gameState.People.some(p => p.IsProtected);
    };

    override GetActions = () => [
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
                if (!await Dialog.ShowConfirmDialog($localize`:@@character-dialog-healer-2:Es kann nicht zwei mal hinter einander die gleiche Person geschützt werden. Trotzdem fortfahren?`)) {
                    return;
                }
            } else if (people[0].Character instanceof SmallChild) {
                if (!await Dialog.ShowConfirmDialog($localize`:@@character-dialog-healer-3:Das kleine Mädchen kann nicht vor den Werwölfen geschützt werden. Trotzdem fortfahren?`)) {
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