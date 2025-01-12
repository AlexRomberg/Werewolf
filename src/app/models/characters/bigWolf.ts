import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "../characters";
import { Werewolf } from "./werewolf";
import { WhiteWolf } from "./whiteWolf";

export class BigWolf implements Character, Action {
    Priority = BasePriority.Wolf + 4;
    Id = "big_wolf";
    IsSingle = true;
    AssignedPerson: Person | undefined;
    private isDone = false;

    GetPoints = () => [
        !this.AssignedPerson && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-big_wolf-2:Kann zweites Opfer definieren`];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                Title: $localize`:@@character-button-big_wolf-1:Zweites Opfer markieren`,
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
            const people = await Dialog.ShowPeopleDialog($localize`:@@character-dialog-big_wolf-1:Wähle das zweite Opfer (kein Werwolf) aus`, 1);
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