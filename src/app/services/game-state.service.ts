import { Injectable } from "@angular/core";
import { Action, Character, Connection, ConnectionTypes, Person } from "../types";
import { DaybreakAction, NightfallAction, RulesAction } from "../models/actions/generic";

@Injectable({
    providedIn: "root"
})
export class GameStateService {
    public Night = 0;
    public People: Person[] = [];
    public Connections: Connection[] = [];
    public Characters: Character[] = [];
    public Actions: Action[] = [];
    public ActionHistory: Action[] = [];

    public StartGame(): void {
        this.Night = 0;
        this.Actions = [];
        this.ActionHistory = [];
        this.Connections = [];

        this.Actions.push(RulesAction);
        this.LoadNightActions();
    }

    public LoadNightActions(): void {
        this.Actions.push(NightfallAction);
        this.Actions.push(...this.Characters.filter(this.filterActivePeople.bind(this)));
        this.Actions.push(DaybreakAction);
    }

    public NextAction(): void {
        const currentAction = this.Actions.shift();
        if (!currentAction) { return; }

        this.ActionHistory.push(currentAction);
        if (this.Actions.length <= 1) {
            this.HandleNightOver();
        }
    }

    public HandleNightOver(): void {
        const diedPeople = [];
        for (const person of this.People) {
            if (person.IsVictim && !person.IsProtected) {
                person.IsVictim = false;
                person.IsDead = true;
                diedPeople.push(person, ...this.handleConsequenceofDeath(person));
            }
            person.IsProtected = false;
        }
        this.Connections = this.Connections.filter(c => c.Type !== ConnectionTypes.Sleepover);

        this.Night++;
        this.LoadNightActions();
        this.ActionHistory = [];
    }

    public PreviousAction(): void {
        const lastAction = this.ActionHistory.pop();
        if (!lastAction) { return; }

        this.Actions.unshift(lastAction);
    }

    private handleConsequenceofDeath(person: Person, isFollowUpCheck = false): Person[] {
        const connections = this.Connections.filter(c => c.From === person || c.To === person).map(c => ({ person: (c.From === person ? c.To : c.From), type: c.Type }));
        const diedPeople: Person[] = [];

        for (const connection of connections) {
            switch (connection.type) {
                case ConnectionTypes.Trust:
                    if (connection.person.Character?.Image === "wild_child") {
                        connection.person.IsWerewolf = true;
                    }
                    break;
                case ConnectionTypes.Love:
                    if (!isFollowUpCheck && !connection.person.IsDead) {
                        connection.person.IsVictim = false;
                        connection.person.IsDead = true;
                        diedPeople.push(connection.person);
                        this.handleConsequenceofDeath(connection.person, true);
                    }
                    break;
                case ConnectionTypes.Sleepover:
                    if (!isFollowUpCheck && connection.person.Character?.Image === "bitch") {
                        connection.person.IsVictim = false;
                        connection.person.IsDead = true;
                        diedPeople.push(connection.person);
                        this.handleConsequenceofDeath(connection.person, true);
                    }
                    break;
            }
        }
        return diedPeople;
    }

    private filterActivePeople(role: Character): boolean {
        if (role.Image === "werewolf") {
            return true;
        }
        if (!role.IsAwakeThisNight(this.Night, this)) {
            return false;
        }
        if (role.AssignedPerson && role.AssignedPerson.IsDead) {
            return false;
        }
        if ((role.AssignedPeople?.length ?? 0) > 0 && role.AssignedPeople!.every(p => p.IsDead)) {
            return false;
        }
        return true;
    }
}
