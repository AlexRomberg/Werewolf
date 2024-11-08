import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";
import { Werewolf } from "./werewolf";
import { WhiteWolf } from "./whiteWolf";

export class BigWolf implements Character, Action {
    Priority = BasePriority.Wolf + 4;
    Image = "big_wolf";
    Name = "Der Grosse, böse Wolf";
    IsSingle = true;
    AssignedPerson: Person | undefined;
    private isDone = false;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Kann zweites Opfer definieren"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: "Zweites Opfer markieren",
                Action: this.registerVictim.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = (night: number, gameState: GameStateService) => {
        this.isDone = false;
        return gameState.People.filter(p => p.IsDead && (p.Character instanceof Werewolf || p.Character instanceof WhiteWolf || p.Character instanceof BigWolf || p.IsWerewolf)).length == 0;
    };

    private async registerVictim({ Dialog }: { Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleDialog("Wähle das zweite Opfer (kein Werwolf) aus", 1);
            if (people[0].IsProtected || people[0].IsVictim) {
                return;
            }
            people[0].IsVictim = true;
            this.isDone = true;
        } catch {
            // closed
        }
    }
}