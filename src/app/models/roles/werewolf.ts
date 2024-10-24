import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CirclePerson } from "../../types";
import { RequestAssignments } from "../actions/buttons";
import { BasePriority, Role } from "./roles";

export class Werewolf implements Role {
    public Priority = BasePriority.Wolf + 1;
    public Image = "werewolf";
    public Name = "Der Einfache Werewolf";
    public AssignedPeople: CirclePerson[] = [];

    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [role.AssignedPeople.length <= 0 && "Person zuweisen", "Müssen ein Opfer finden"] },
            get buttons() {
                const buttons = [];
                if (role.AssignedPeople.length <= 0) {
                    buttons.push(RequestAssignments(role));
                }
                buttons.push({
                    title: "Opfer markieren", action: role.RegisterVictim.bind(role)
                });
                return buttons;
            }
        }
    }

    private async RegisterVictim({ dialog, gameState }: { gameState: GameStateService, dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Wähle das Opfer aus", 1);
            gameState.People.forEach(p => p.victim = false);
            people[0].victim = true;
        } catch {
            // closed
        }
    }

    IsAwakeThisNight = () => true;
}