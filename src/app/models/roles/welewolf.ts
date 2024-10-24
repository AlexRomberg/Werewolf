import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CirclePerson } from "../../types";
import { Role } from "./roles";

export class Werewolf implements Role {
    public Image = "werewolf";
    public Name = "The werewolf";
    private assignedPeople: CirclePerson[] = [];

    public Action: Action;

    constructor() {
        const werewolf = this;

        this.Action = {
            title: werewolf.Name,
            get points() { return [werewolf.assignedPeople.length <= 0 && "Need to be assigned", "Need to find a target"] },
            get buttons() {
                const buttons = [];
                if (werewolf.assignedPeople.length <= 0) {
                    buttons.push({
                        title: "Assign people", action: werewolf.RequstAssignment.bind(werewolf)
                    });
                }
                buttons.push({
                    title: "Register victim", action: werewolf.RegisterVictim.bind(werewolf)
                });
                return buttons;
            }
        }
    }

    private async RequstAssignment({ dialog }: { dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Select people");
            for (const person of people) {
                person.role = this
            }
            this.assignedPeople = people;
        } catch {
            // closed
        }
    }

    private async RegisterVictim({ dialog, gameState }: { gameState: GameStateService, dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Select victim of werewolfs", 1);
            gameState.People.forEach(p => p.victim = false);
            people[0].victim = true;
        } catch {
            // closed
        }
    }

    IsAwakeThisNight = () => true;

}