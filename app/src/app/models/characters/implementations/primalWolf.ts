import { StateService } from "../../../services/state.service";
import { ActionButton, GameSets, GroupTypes } from "../../../types";
import { RequestAssignment } from "../../actions/buttons";
import { BasePriority } from "../../../types";
import { WerewolfCharacter } from "../werewolfCharacter";

export class PrimalWolf extends WerewolfCharacter {
    readonly Id = "primal_wolf";
    readonly Group = GroupTypes.Wolves;
    readonly Game = GameSets.Characters;
    override readonly Priority = BasePriority.Wolf + 3;
    override readonly Description = [
        { title: $localize`:@@character-description-general:Allgemein`, description: $localize`:@@character-description-primal_wolf-general:Jede Nacht erwacht der Urwolf mit den anderen Wolfen und sucht sich ein Opfer. Daraufhin darf er, sofern er möchte, nach dem Einschlafen der Wölfe den Spielleiter durch Handzeichen darauf hinweisen, dass er seine Sonderfähigkeit einsetzen und das letzte Opfer infizieren möchte. Diese Fähigkeit ist nur einmal im Spiel einsetzbar. Der Spielleiter berührt daraufhin den Infizierten, welcher sofort zu einem Werwolf wird und ab der nächsten Nacht jede Nacht mit den Wölfen zusammen erwacht und ein Opfer sucht. Sollte dieser Charakter eine nachtaktive Spezialfähigkeit besitzen, erwacht der Spieler nach wie vor nach Aufruf durch den Spielleiter – zusätzlich zur Wolfsphase.` }];

    private isDone = false;

    override GetActions = () => [
        !this.isAssigned && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-primal_wolf-2:Kann Opfer zu Werwolf machen`];
    override GetButtons = () => {
        const buttons: ActionButton[] = [];
        if (!this.isAssigned) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-primal_wolf-1:Opfer zu Werwolf verwandeln`,
                Action: this.requestVictimStateChangePerson.bind(this),
            });
        }
        return buttons;
    };

    override IsAwakeThisNight = (_round: number, gameState: StateService) => !(this.isDone || gameState.People.some(p => p.IsDead && this.isWerewolf(p)));

    private async requestVictimStateChangePerson({ GameState }: { GameState: StateService }) {
        const victim = GameState.People.find(p => p.IsVictim);
        if (victim) {
            victim.IsVictim = false;
            victim.IsWerewolf = true;
            this.isDone = true;
        }
    }
}