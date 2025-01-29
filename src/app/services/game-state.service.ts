import { Injectable } from "@angular/core";
import { ActionProvider, Connections, ConnectionTypes } from "../types";
import { DaybreakAction, NightfallAction, RulesAction } from "../models/actions/generic";
import { Character } from "../models/characters/character";
import { Angel } from "../models/characters/implementations/angel";
import { BearGuide } from "../models/characters/implementations/bearGuide";
import { BigWolf } from "../models/characters/implementations/bigWolf";
import { Bitch } from "../models/characters/implementations/bitch";
import { Brothers } from "../models/characters/implementations/brothers";
import { Cupit } from "../models/characters/implementations/cupit";
import { FlutePlayer } from "../models/characters/implementations/flutePlayer";
import { Fox } from "../models/characters/implementations/fox";
import { Healer } from "../models/characters/implementations/healer";
import { Hunter } from "../models/characters/implementations/hunter";
import { Juggler } from "../models/characters/implementations/juggler";
import { Knight } from "../models/characters/implementations/knight";
import { Old } from "../models/characters/implementations/old";
import { OldMan } from "../models/characters/implementations/oldMan";
import { PrimalWolf } from "../models/characters/implementations/primalWolf";
import { Scapegoat } from "../models/characters/implementations/scapegoat";
import { Seer } from "../models/characters/implementations/seer";
import { Sisters } from "../models/characters/implementations/sisters";
import { SmallChild } from "../models/characters/implementations/smallChild";
import { Thief } from "../models/characters/implementations/thief";
import { VillageIdiot } from "../models/characters/implementations/villageIdiot";
import { Villager } from "../models/characters/implementations/villager";
import { Werewolf } from "../models/characters/implementations/werewolf";
import { WhiteWolf } from "../models/characters/implementations/whiteWolf";
import { WildChild } from "../models/characters/implementations/wildChild";
import { Witch } from "../models/characters/implementations/witch";
import { WolfDog } from "../models/characters/implementations/wolfDog";
import { Person } from "../models/state/person";
import { GameState } from "../models/state/gameState";
import { Judge } from "../models/characters/implementations/judge";
import { Maid } from "../models/characters/implementations/maid";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class GameStateService {
    private allCharacters: Character[] = [];
    private state = new GameState(this.saveState.bind(this));

    public Actions: ActionProvider[] = [];
    public ActionHistory: ActionProvider[] = [];

    public get Round() { return this.state.Round; };
    public get People(): Person[] { return this.state.People; };
    public get Connections(): Connections { return this.state.Connections; }
    public get AllCharacters() { return this.allCharacters; }
    public get SelectedCharacters() {
        return this.state.SelectedCharacters;
    }
    public set SelectedCharacters(value: Character[]) {
        this.state.SelectedCharacters = value;
        this.saveState();
    }

    constructor() {
        this.resetCharacters();

        if (!environment.isTesting) {
            this.state = GameState.deserialize(window.localStorage.getItem("werewolf-state"), this.allCharacters, this.saveState.bind(this));
        }
    }

    public addPerson() {
        const newPerson = new Person(this.saveState.bind(this));
        this.state.People = [...this.state.People, newPerson];
    }

    public removePerson(person: Person) {
        this.state.People = this.state.People.filter(p => p !== person);
    }

    public addConnection(type: ConnectionTypes, from: Person, to: Person) {
        this.state.Connections.set(type, { From: from, To: to });
        this.saveState();
    }

    public removeConnection(connectionType: ConnectionTypes) {
        this.state.Connections.delete(connectionType);
        this.saveState();
    }

    public startGame() {
        this.resetGame();
        this.Actions = [];
        this.ActionHistory = [];
        this.applyNightActions();
    }

    public startNextRound() {
        this.state.Round++;
        for (const character of this.state.SelectedCharacters) {
            character.resetAfterNight();
        }
        this.state.Connections = new Map();
        this.applyNightActions();
        this.saveState();
    }

    public applyNightActions() {
        this.ActionHistory = [];
        this.Actions = [];
        if (this.state.Round === 0) {
            this.Actions.push(RulesAction);
        }
        this.Actions.push(NightfallAction);
        this.Actions.push(...this.getActionsForNight());
        this.Actions.push(DaybreakAction);
    }

    public getActionsForNight() {
        return [
            ...(this.state.Round === 0 ? [RulesAction] : []),
            NightfallAction,
            ...this.SelectedCharacters.filter(this.filterActiveActions.bind(this)) as ActionProvider[],
            DaybreakAction,
        ];
    }

    private filterActiveActions(character: Character): boolean {
        if (character.Id === "werewolf") {
            return true;
        }
        if (!character.IsAwakeThisNight(this.state.Round, this)) {
            return false;
        }

        const assignedPeople = this.getPeopleForCharacter(character);
        if (assignedPeople.length > 0 && assignedPeople.every(p => p.IsDead)) {
            return false;
        }

        return true;
    }

    public getPeopleForCharacter(character: Character) {
        return this.state.People.filter(p => p.Character === character);
    }

    public resetGame() {
        this.resetCharacters();
        const selectedCharacterIds = this.state.SelectedCharacters.map(c => c.Id);
        const selectedCharacters = this.allCharacters.filter(c => selectedCharacterIds.includes(c.Id));
        this.state.reset(selectedCharacters);
    }

    private resetCharacters() {
        this.allCharacters = [
            new Angel(this),
            new BearGuide(this),
            new BigWolf(this),
            new Bitch(this),
            new Brothers(this),
            new Cupit(this),
            new FlutePlayer(this),
            new Fox(this),
            new Healer(this),
            new Hunter(this),
            new Judge(this),
            new Juggler(this),
            new Knight(this),
            new Maid(this),
            new Old(this),
            new OldMan(this),
            new PrimalWolf(this),
            new Scapegoat(this),
            new Seer(this),
            new Sisters(this),
            new SmallChild(this),
            new Thief(this),
            new VillageIdiot(this),
            new Villager(this),
            new Werewolf(this),
            new WhiteWolf(this),
            new WildChild(this),
            new Witch(this),
            new WolfDog(this),
        ];
    }

    private saveState() {
        window.localStorage.setItem("werewolf-state", this.state.serialize())
    }

    // CLEANED UP CODE ------------------------------------------------------------------------------------------------------------------------------------

    public NextAction(): void {
        const currentAction = this.Actions.shift();
        if (!currentAction) { return; }

        this.ActionHistory.push(currentAction);
        if (this.Actions.length <= 1) {
            // this.HandleNightOver();
        }
    }

    public PreviousAction(): void {
        const lastAction = this.ActionHistory.pop();
        if (!lastAction) { return; }

        this.Actions.unshift(lastAction);
    }

    // public HandleNightOver(): void {
    //     // const diedPeople = [];
    //     for (const person of this.People) {
    //         if (person.IsVictim && !person.IsProtected) {
    //             // person.IsVictim = false;
    //             // person.IsDead = true;
    //             // diedPeople.push(person, ...this.handleConsequenceofDeath(person));
    //         }
    //         // person.IsProtected = false;
    //     }
    //     // this.Connections = this.Connections.filter(c => c.Type !== ConnectionTypes.Sleepover);

    //     this.state.round++;
    //     this.LoadNightActions();
    //     this.ActionHistory = [];
    // }

    // private handleConsequenceofDeath(person: iPerson, isFollowUpCheck = false): iPerson[] {
    //     const connections = this.Connections.filter(c => c.From === person || c.To === person).map(c => ({ person: (c.From === person ? c.To : c.From), type: c.Type }));
    //     const diedPeople: iPerson[] = [];

    //     for (const connection of connections) {
    //         switch (connection.type) {
    //             case ConnectionTypes.Trust:
    //                 if (connection.person.Character?.Id === "wild_child") {
    //                     connection.person.IsWerewolf = true;
    //                 }
    //                 break;
    //             case ConnectionTypes.Love:
    //                 if (!isFollowUpCheck && !connection.person.IsDead) {
    //                     connection.person.IsVictim = false;
    //                     connection.person.IsDead = true;
    //                     diedPeople.push(connection.person);
    //                     this.handleConsequenceofDeath(connection.person, true);
    //                 }
    //                 break;
    //             case ConnectionTypes.Sleepover:
    //                 if (!isFollowUpCheck && connection.person.Character?.Id === "bitch") {
    //                     connection.person.IsVictim = false;
    //                     connection.person.IsDead = true;
    //                     diedPeople.push(connection.person);
    //                     this.handleConsequenceofDeath(connection.person, true);
    //                 }
    //                 break;
    //         }
    //     }
    //     return diedPeople;
    // }

    // private filterActivePeople(role: Character): boolean {
    //     if (role.Id === "werewolf") {
    //         return true;
    //     }
    //     if (!role.IsAwakeThisNight(this.Round, this)) {
    //         return false;
    //     }
    //     // if (role.AssignedPerson && role.AssignedPerson.IsDead) {
    //     //     return false;
    //     // }
    //     // if ((role.AssignedPeople?.length ?? 0) > 0 && role.AssignedPeople!.every(p => p.IsDead)) {
    //     //     return false;
    //     // }
    //     return true;
    // }
}
