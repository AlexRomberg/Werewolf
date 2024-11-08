import { GameStateService } from "../../services/game-state.service";
import { Action, ActionButton, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BigWolf } from "./bigWolf";
import { BasePriority } from "./roles";
import { Werewolf } from "./werewolf";
import { WhiteWolf } from "./whiteWolf";

export class PrimalWolf implements Character, Action {
    public Priority = BasePriority.Wolf + 3;
    public Image = "primal_wolf";
    public Name = "Der Urwolf";
    public AssignedPerson?: Person | undefined;
    public IsSingle = true;
    private isDone = false;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Kann Opfer zu Werwolf machen"];
    GetButtons = () => {
        const buttons: ActionButton[] = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: "Opfer zu Werwolf verwandeln",
                Action: this.requestVictimStateChangePerson.bind(this),
            });
        }
        return buttons;
    };
    IsAwakeThisNight = (night: number, gameState: GameStateService) => !this.isDone && gameState.People.filter(p => p.IsDead && (p.Character instanceof Werewolf || p.Character instanceof WhiteWolf || p.Character instanceof BigWolf || p.IsWerewolf)).length == 0;

    private async requestVictimStateChangePerson({ GameState }: { GameState: GameStateService }) {
        const victim = GameState.People.find(p => p.IsVictim);
        if (victim) {
            victim.IsVictim = false;
            victim.IsWerewolf = true;
            this.isDone = true;
        }
    }
}