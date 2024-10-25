import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignments } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Werewolf implements Role, Action {
    public Priority = BasePriority.Wolf + 1;
    public Image = "werewolf";
    public Name = "Der Einfache Werewolf";
    public AssignedPeople: CirclePerson[] = [];

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
            gameState.People.forEach(p => p.victim = false);
            people[0].victim = true;
        } catch {
            // closed
        }
    }
}