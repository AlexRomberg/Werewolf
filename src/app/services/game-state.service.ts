import { Injectable } from "@angular/core";
import { Action, CircleConnection, CircleConnectionTypes, CirclePerson, Role } from "../types";
import { DaybreakAction, NightfallAction, RulesAction } from "../models/actions/generic";
import { WildChild } from "../models/roles/wildChild";
import { Bitch } from "../models/roles/bitch";
import { Werewolf } from "../models/roles/werewolf";

@Injectable({
    providedIn: "root"
})
export class GameStateService {
    public Night = 0;
    public People: CirclePerson[] = [];
    public Connections: CircleConnection[] = [];
    public Characters: Role[] = [];
    public Actions: Action[] = [];
    public ActionHistory: Action[] = [];

    public StartGame() {
        this.Night = 0;
        this.Actions = [];
        this.ActionHistory = [];
        this.Connections = [];

        this.Actions.push(RulesAction);
        this.LoadNightActions();
    }

    public LoadNightActions() {
        this.Actions.push(NightfallAction);
        this.Actions.push(...this.Characters.filter(this.filterActivePeople.bind(this)));
        this.Actions.push(DaybreakAction);
    }

    public NextAction() {
        const currentAction = this.Actions.shift();
        if (!currentAction) { return; }

        this.ActionHistory.push(currentAction);
        if (this.Actions.length <= 1) {
            this.handleNightOver();
        }
    }

    public handleNightOver() {
        const diedPeople = [];
        for (const person of this.People) {
            if (person.isVictim && !person.isProtected) {
                person.isVictim = false;
                person.isDead = true;
                diedPeople.push(person, ...this.handleConsequenceofDeath(person));
            }
            person.isProtected = false;
        }
        this.Connections = this.Connections.filter(c => c.type !== CircleConnectionTypes.Sleepover);

        this.Night++;
        this.LoadNightActions();
        this.ActionHistory = [];
    }

    public PreviousAction() {
        const lastAction = this.ActionHistory.pop();
        if (!lastAction) { return; }

        this.Actions.unshift(lastAction);
    }

    private handleConsequenceofDeath(person: CirclePerson, isFollowUpCheck = false) {
        const connections = this.Connections.filter(c => c.from === person || c.to === person).map(c => ({ person: (c.from === person ? c.to : c.from), type: c.type }));
        const diedPeople: CirclePerson[] = [];
        for (const connection of connections) {
            switch (connection.type) {
                case CircleConnectionTypes.Trust:
                    if (connection.person.role instanceof WildChild) {
                        connection.person.isWerewolf = true;
                    }
                    break;
                case CircleConnectionTypes.Love:
                    if (!isFollowUpCheck && !connection.person.isDead) {
                        connection.person.isVictim = false;
                        connection.person.isDead = true;
                        diedPeople.push(connection.person);
                        this.handleConsequenceofDeath(connection.person, true);
                    }
                    break;
                case CircleConnectionTypes.Sleepover:
                    if (!isFollowUpCheck && connection.person.role instanceof Bitch) {
                        connection.person.isVictim = false;
                        connection.person.isDead = true;
                        diedPeople.push(connection.person);
                        this.handleConsequenceofDeath(connection.person, true);
                    }
                    break;
            }
        }
        return diedPeople;
    }

    private filterActivePeople(role: Role) {
        if (role instanceof Werewolf) {
            return true;
        }
        if (!role.IsAwakeThisNight(this.Night, this)) {
            return false;
        }
        if (role.AssignedPerson && role.AssignedPerson.isDead) {
            return false;
        }
        if ((role.AssignedPeople?.length ?? 0) > 0 && role.AssignedPeople!.every(p => p.isDead)) {
            return false;
        }
        return true;
    }
}
