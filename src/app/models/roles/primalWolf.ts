import { GameStateService } from "../../services/game-state.service";
import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BigWolf } from "./bigWolf";
import { BasePriority } from "./roles";
import { Werewolf } from "./werewolf";
import { WhiteWolf } from "./whiteWolf";

export class PrimalWolf implements Role, Action {
    public Priority = BasePriority.Wolf + 3;
    public Image = "primal_wolf";
    public Name = "Der Urwolf";
    public AssignedPerson?: CirclePerson | undefined;
    private isDone = false;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Kann Opfer zu Werwolf machen"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                title: "Opfer zu Werwolf verwandeln",
                action: this.RequestVictimStateChangePerson.bind(this),
            });
        }
        return buttons;
    };
    IsAwakeThisNight = (_: number, gameState: GameStateService) => !this.isDone && gameState.People.filter(p => p.isDead && (p.role instanceof Werewolf || p.role instanceof WhiteWolf || p.role instanceof BigWolf || p.isWerewolf)).length == 0;

    private async RequestVictimStateChangePerson({ gameState }: { gameState: GameStateService }) {
        const victim = gameState.People.find(p => p.isVictim);
        if (victim) {
            victim.isVictim = false;
            victim.isWerewolf = true;
            this.isDone = true;
        }
    }
}