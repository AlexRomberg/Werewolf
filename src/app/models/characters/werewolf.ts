import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, Character, Person } from "../../types";
import { RequestAssignments } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Werewolf implements Character, Action {
    Priority = BasePriority.Wolf + 1;
    Image = "werewolf";
    Name = "Der Einfache Werewolf";
    public IsSingle = false;
    AssignedPeople: Person[] = [];

    GetPoints = () => [this.AssignedPeople.length <= 0 && "Person zuweisen", "Müssen ein Opfer finden"];
    GetButtons = () => {
        const buttons = [];
        if (this.AssignedPeople.length <= 0) {
            buttons.push(RequestAssignments(this));
        }
        buttons.push({
            Title: "Opfer markieren", Action: this.registerVictim.bind(this)
        });
        return buttons;
    };
    IsAwakeThisNight = () => true;

    private async registerVictim({ Dialog, GameState }: { GameState: GameStateService, Dialog: DialogService }) {
        try {
            const people = await Dialog.ShowPeopleDialog("Wähle das Opfer aus", 1);
            if (people[0].IsProtected) {
                return;
            }
            GameState.People.forEach(p => p.IsVictim = false);
            people[0].IsVictim = true;
        } catch {
            // closed
        }
    }
}