import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CirclePerson } from "../../types";
import { Role } from "./roles";

export class Werewolf implements Role {
    public Color = "red";
    private assignedPeople: CirclePerson[] = [];

    public Action: Action;

    constructor() {
        const werewolf = this;

        this.Action = {
            title: "The Werewolfs",
            points: ["Need to find a target"],
            buttons: [
                {
                    title: "Assign person", action: werewolf.RequstAssignment.bind(werewolf)
                },
                {
                    title: "Register victim", action: werewolf.RegisterVictim.bind(werewolf)
                }
            ]
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

    IsAwakeThisNight = (night: number) => night === 0;

}