import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";
import { Werewolf } from "./werewolf";
import { WhiteWolf } from "./whiteWolf";

export class BigWolf implements Role, Action {
    Priority = BasePriority.Wolf + 4;
    Image = "big_wolf";
    Name = "Der Grosse, böse Wolf";
    AssignedPerson: CirclePerson | undefined;
    private isDone = false;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Kann zweites Opfer definieren"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        }
        if (!this.isDone) {
            buttons.push({
                title: "Zweites Opfer markieren",
                action: this.RegisterVictim.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = (_: number, gameState: GameStateService) => {
        this.isDone = false;
        return gameState.People.filter(p => p.isDead && (p.role instanceof Werewolf || p.role instanceof WhiteWolf || p.role instanceof BigWolf || p.isWerewolf)).length == 0;
    };

    private async RegisterVictim({ dialog }: { dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Wähle das zweite Opfer (kein Werwolf) aus", 1);
            if (people[0].isProtected || people[0].isVictim) {
                return;
            }
            people[0].isVictim = true;
            this.isDone = true;
        } catch {
            // closed
        }
    }
}