import { DialogService } from "../../../services/dialog.service";
import { GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { Character } from "../character";
import { BasePriority } from "../../../types";

export class FlutePlayer extends Character {
    readonly Id = "flute_player";
    readonly Group = GroupTypes.Loners;
    readonly Game = GameSets.NewMoon;
    override readonly Priority = BasePriority.PostWolf + 2;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-flute_player-general:Jede Nacht bestimmt der Flötenspieler beim Aufruf des Spielleiters zwei Spieler, deren Schulter der Spielleiter berührt. Der Flötenspieler schläft wieder ein. Der Spielleiter gibt den neuen und den bereits Verzauberten die Anweisung zu erwachen. Sie erkennen sich und schlafen wieder ein. Ab dem Zeitpunkt an dem es keine Spieler mehr gibt, die nicht verzaubert sind, gewinnt der Flötenspieler gegen alle anderen Spieler (selbst wenn dies durch eine Abstimmung oder Dank der Werwölfe geschieht).` },
        { title: $localize`:@@character-description-attention:Achtung`, description: $localize`:@@character-description-flute_player-attention:Der Flötenspieler kann sich nicht selbst verzaubern. Der Heiler schützt nicht vor der Verzauberung, und die Hexe kann die Verzauberung nicht heilen. Die Werwölfe sind gegen die Verzauberung nicht immun. Die verzauberten Spieler behalten all ihre Fähigkeiten und Eigenschaften. Die Verzauberung überträgt sich nicht zwischen Verliebten.` }
    ];

    private get isDone() {
        return this.gameState.People.some(p => p.IsEnchanted);
    };

    override GetActions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-flute_player-2:Kann zwei Personen verzaubern`];
    override GetButtons = () => {
        const buttons = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-flute_player-1:Opfer markieren`,
                Action: this.registerVictim.bind(this)
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = () => {
        return true;
    };

    private async registerVictim({ Dialog }: { Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleSelectionDialog($localize`:@@character-dialog-flute_player-1:Wähle zwei Opfer aus`, 2);
            for (const person of people) {
                person.IsEnchanted = true;
            }
        } catch {
            // closed
        }
    }
}