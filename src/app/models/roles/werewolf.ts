import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignments } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Werewolf implements Role, Action {
    Priority = BasePriority.Wolf + 1;
    Image = "werewolf";
    Name = "Der Einfache Werewolf";
    AssignedPeople: CirclePerson[] = [];

    GetPoints = () => [this.AssignedPeople.length <= 0 && "Person zuweisen", "Müssen ein Opfer finden"];
    GetButtons = () => {
        const buttons = [];
        if (this.AssignedPeople.length <= 0) {
            buttons.push(RequestAssignments(this));
        }
        buttons.push({
            title: "Opfer markieren", action: this.RegisterVictim.bind(this)
        });
        return buttons;
    };
    IsAwakeThisNight = () => true;

    private async RegisterVictim({ dialog, gameState }: { gameState: GameStateService, dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Wähle das Opfer aus", 1);
            if (people[0].isProtected) {
                return;
            }
            gameState.People.forEach(p => p.isVictim = false);
            people[0].isVictim = true;
        } catch {
            // closed
        }
    }
}