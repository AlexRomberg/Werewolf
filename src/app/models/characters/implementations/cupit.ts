import { DialogService } from "../../../services/dialog.service";
import { StateService } from "../../../services/state.service";
import { ConnectionTypes, GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class Cupit extends Character {
    readonly Id = "cupit";
    readonly Group = GroupTypes.Active;
    readonly Game = GameSets.BaseGame;
    override readonly Priority = BasePriority.Initial + 3;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-cupit-general:In der ersten Nacht (Einleitungsrunde) bestimmt er die zwei Spieler (egal welchen Geschlechts), die sich ineinander verlieben. Amor kann auch sich selbst als einen der Verliebten wählen. Wenn einer der beiden Verliebten ausscheidet, stirbt der andere Verliebte aus Kummer und scheidet ebenfalls sofort aus. Ein Verliebter darf nie gegen seinen Verliebten stimmen oder ihm auf eine andere Weise schaden (auch nicht zur Täuschung).` },
        { title: $localize`:@@character-description-attention:Achtung`, description: $localize`:@@character-description-cupit-attention:Wenn einer der beiden Verliebten ein Werwolf und der andere ein Dorfbewohner ist, haben diese beiden Spieler ein neues Spielziel: Um gemeinsam in Liebe weiterleben zu können und das Spiel zu gewinnen, müssen sie alle anderen Spieler, sowohl Dorfbewohner als auch Werwölfe, unter Beachtung der Spielregeln eliminieren.` }];

    private get isDone() {
        return this.gameState.Connections.some(c => c.ConnectionType === ConnectionTypes.Love);
    };

    override GetActions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        !this.isDone && $localize`:@@character-action-cupit-2:Muss ein Paar bestimmen`,
        $localize`:@@character-action-cupit-3:Das Paar muss erwachen`];
    override GetButtons = () => {
        const buttons = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-cupit-1:Paar zuweisen`, Action: this.requestCouple.bind(this)
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = (round: number) => round === 0;

    private async requestCouple({ GameState, Dialog }: { GameState: StateService, Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleSelectionDialog($localize`:@@character-dialog-cupit-1:Ein Paar auswählen`, 2);
            GameState.addConnection(
                ConnectionTypes.Love,
                people[0],
                people[1]
            );
        } catch {
            // closed
        }
    }
}