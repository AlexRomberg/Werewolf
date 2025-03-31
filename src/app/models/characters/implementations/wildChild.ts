import { DialogService } from "../../../services/dialog.service";
import { StateService } from "../../../services/state.service";
import { ConnectionTypes, GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class WildChild extends Character {
    readonly Id = "wild_child";
    readonly Group = GroupTypes.Wolves;
    readonly Game = GameSets.Characters;
    override readonly Priority = BasePriority.Initial + 8;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-wild_child-general:Das Wilde Kind ist ein Dorfbewohner. In der ersten Nacht wird es vom Spielleiter aufgerufen und wählt still sein Vorbild. Wird dieses im Laufe des Spiels getötet, so kehrt das Wilde Kind dem Dorf den Rücken und geht zu den Wölfen zurück. Von nun an erwacht es jede Nacht bis zum Ende des Spiels als Werwolf und sucht sich mit ihnen ein Opfer. Solange das Vorbild am Leben ist, bleibt das Wilde Kind ein Dorfbewohner. Selbst ein Werwolf als Vorbild ändert daran nichts. Ebenso kann sich das Wilde Kind daran beteiligen, sein Vorbild zu eliminieren – sofern es dies wünscht. Ist sein Vorbild im Spiel und sind alle Wölfe ausgeschieden, gewinnt das Kind mit den Dorfbewohnern. Ist sein Vorbild ausgeschieden und die Wölfe gewinnen, teilt es auch diesen Sieg.` },
        { title: $localize`:@@character-description-hint-for-narrator:Tipp für den Spielleiter`, description: $localize`:@@character-description-wild_child-hint-for-narrator:Es kann die Spannung erhöhen, wenn die wahre Identität des Kindes nicht verraten wird, sollte es durch die Wahl des Dorfes ausscheiden. So bleiben Zweifel, ob denn nun ein Dorfbewohner oder doch ein Werwolf eliminiert wurde.` }];
    private get isDone() {
        return this.gameState.Connections.some(c => c.ConnectionType === ConnectionTypes.Trust);
    };

    override GetActions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.isDone && $localize`:@@character-action-wild_child-2:Muss ein Vorbild wählen`,
        $localize`:@@character-action-wild_child-3:Wird zum Werwolf, wenn Vorbild stirbt`];
    override GetButtons = () => {
        const buttons = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        } else if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-wild_child-1:Vorbild zuweisen`, Action: this.requstRolemodel.bind(this)
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = (round: number) => round === 0;

    private async requstRolemodel({ GameState, Dialog }: { GameState: StateService, Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleSelectionDialog($localize`:@@character-dialog-wild_child-1:Wähle das Vorbild aus`, 1);
            GameState.addConnection(
                ConnectionTypes.Trust,
                this.gameState.getPeopleForCharacter(this)[0],
                people[0]
            );
        } catch {
            // closed
        }
    }
}