import { DialogService } from "../../../services/dialog.service";
import { StateService } from "../../../services/state.service";
import { ConnectionTypes, GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";
import { Person } from "../../state/person";

export class Hoodrat extends Character {
    readonly Id = "hoodrat";
    readonly Group = GroupTypes.Active;
    readonly Game = GameSets.Special;
    override readonly Priority = BasePriority.Initial + 11;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-hoodrat-general:Wenn die Dorfmatratze nachts vor den Werwölfen aufgerufen wird, kann sie wählen ob sie bei einem anderen Spieler diese nacht unterkommt. Sollte dieser Spieler in der Nacht sterben, stirbt sie mit. Wird die Dorfmatratze von den Werwölfen heimgesucht während sie bei einem anden Spieler ist, beleibt sie verschont.` },
        { title: $localize`:@@character-description-attention:Achtung`, description: $localize`:@@character-description-hoodrat-attention:Die Dorfmatratze kann auch bei sich Zuhause bleiben. Sie darf nicht in zwei aufeinanderfolgenden Nächten bei demselben Spieler übernachten. Tränke der Hexe und der Schutz des Heilers werden von dem Spieler auf die Dorfmatratze angewendet, jedoch nicht umgekeht.` }];
    private lastJoinedPerson: Person | undefined;
    private get isDone() {
        return this.gameState.Connections.some(c => c.ConnectionType === ConnectionTypes.Sleepover);
    };

    override GetActions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.isDone && $localize`:@@character-action-hoodrat-2:Kann neues Zuhause suchen für die Nacht`,
        this.isDone && $localize`:@@character-action-hoodrat-3:Ist fertig für diese Nacht`];
    override GetButtons = () => {
        const buttons = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        } else if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-hoodrat-1:Gastgeber zuweisen`,
                Action: this.requestHostPerson.bind(this)
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = () => { return true; };
    override resetAfterNight = () => { this.gameState.removeConnection(ConnectionTypes.Sleepover) };

    private async requestHostPerson({ Dialog, GameState }: { Dialog: DialogService, GameState: StateService }) {
        try {
            const people = await Dialog.ShowPeopleSelectionDialog($localize`:@@character-dialog-hoodrat-1:Eine Person auswählen`, 1);
            if (people[0] === this.lastJoinedPerson) {
                if (!await Dialog.ShowConfirmDialog($localize`:@@character-dialog-hoodrat-2:Es darf nicht zwei mal hinter einander die gleiche Person gewählt werden. Trotzdem fortfahren?`)) {
                    return;
                }
            }

            this.lastJoinedPerson = people[0];
            GameState.addConnection(
                ConnectionTypes.Sleepover,
                this.gameState.getPeopleForCharacter(this)[0],
                people[0]
            );
        } catch {
            // closed
        }
    }
}