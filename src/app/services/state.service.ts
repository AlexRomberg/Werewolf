import { computed, Injectable, signal } from "@angular/core";
import { ActionProvider, AppState, ChangeReason, Connection, Connections, ConnectionTypes, DaybreakChange, State } from "../types";
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
export class StateService {
    private allCharacters: Character[] = [];
    private gameState = new GameState(this.saveState.bind(this));
    private appState: AppState = {
        inGame: false,
        spotify: {
            musicStarted: false,
            currentDevice: undefined
        }
    };

    public Actions: ActionProvider[] = [];
    public ActionHistory: ActionProvider[] = [];
    public Changes: DaybreakChange[] = [];

    public get Round() { return this.gameState.Round; };
    public get Connections(): Connection[] { return this.gameState.Connections; }
    public get AllCharacters() { return this.allCharacters; }

    public get People(): Person[] { return this.gameState.People; };
    public set People(value: Person[]) {
        this.gameState.People = value;
        this.saveState();
    }

    public get SelectedCharacters() { return this.gameState.SelectedCharacters; }
    public set SelectedCharacters(value: Character[]) {
        this.gameState.SelectedCharacters = value;
        this.saveState();
    }

    public get InGame() { return this.appState.inGame; }
    public set InGame(value: boolean) {
        this.appState.inGame = value;
        this.saveState();
    }

    public get MusicStarted() { return this.appState.spotify.musicStarted; }
    public set MusicStarted(value: boolean) {
        this.appState.spotify.musicStarted = value;
        this.saveState();
    }

    public get CurrentDeviceId() { return this.appState.spotify.currentDevice; }
    public set CurrentDeviceId(value: string | undefined) {
        this.appState.spotify.currentDevice = value;
        this.saveState();
    }

    constructor() {
        this.resetCharacters();

        if (!environment.isTesting) {
            this.gameState = GameState.deserialize(window.localStorage.getItem("werewolf-game-state"), this.allCharacters, this.saveState.bind(this));
            this.Actions = this.getActionsForNight();

            this.appState = { inGame: false, spotify: { musicStarted: false, currentDevice: undefined }, ...JSON.parse(window.localStorage.getItem("werewolf-app-state") ?? "{}") };
            (window as any).state = { game: this.gameState, app: this.appState };
        }
    }

    public addPerson() {
        const newPerson = new Person(this.saveState.bind(this));
        this.gameState.People = [...this.gameState.People, newPerson];
    }

    public removePerson(person: Person) {
        this.gameState.People = this.gameState.People.filter(p => p !== person);
    }

    public addConnection(type: ConnectionTypes, from: Person, to: Person) {
        console.log("Adding connection", type, from, to);

        this.gameState.Connections = [
            ...this.gameState.Connections.filter(c => c.ConnectionType !== type),
            { ConnectionType: type, From: from, To: to }
        ];
        this.saveState();
    }

    public removeConnection(connectionType: ConnectionTypes) {
        this.gameState.Connections = this.gameState.Connections.filter(c => c.ConnectionType !== connectionType);
        this.saveState();
    }

    public startGame() {
        this.InGame = true;
        this.resetGame();
        this.Actions = [];
        this.ActionHistory = [];
        this.Actions = this.getActionsForNight();
    }

    public startNextRound() {
        this.gameState.Round++;
        for (const changes of this.Changes) {
            changes.apply();
        }

        for (const character of this.gameState.SelectedCharacters) {
            character.resetAfterNight();
        }
        this.ActionHistory = [];
        this.Actions = this.getActionsForNight();
        this.saveState();
    }

    public getActionsForNight() {
        return [
            ...(this.gameState.Round === 0 ? [new RulesAction(this)] : []),
            NightfallAction,
            ...this.SelectedCharacters
                .filter(this.filterActiveActions.bind(this))
                .sort((a, b) => a.Priority - b.Priority) as ActionProvider[],
            new DaybreakAction(this),
        ];
    }

    private filterActiveActions(character: Character): boolean {
        if (character instanceof Werewolf) {
            return true;
        }
        if (!character.IsAwakeThisNight(this.gameState.Round, this)) {
            return false;
        }

        const assignedPeople = this.getPeopleForCharacter(character);
        if (assignedPeople.length > 0 && assignedPeople.every(p => p.IsDead)) {
            return false;
        }

        return true;
    }

    public getPeopleForCharacter(character: Character) {
        return this.gameState.People.filter(p => p.Character === character);
    }

    private resetGame() {
        this.resetCharacters();
        const selectedCharacterIds = this.gameState.SelectedCharacters.map(c => c.Id);
        const selectedCharacters = this.allCharacters.filter(c => selectedCharacterIds.includes(c.Id));
        this.gameState.reset(selectedCharacters);
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
        window.localStorage.setItem("werewolf-game-state", this.gameState.serialize());
        window.localStorage.setItem("werewolf-app-state", JSON.stringify(this.appState));
    }

    public nextAction(): void {
        const currentAction = this.Actions.shift();
        if (!currentAction) { return; }

        this.ActionHistory.push(currentAction);
        if (this.Actions.length <= 0) {
            this.startNextRound();
        } else if (this.Actions.length === 1) {
            this.Changes = this.getChangesOnNightOver();
            this.ActionHistory = [];
        }
    }

    public previousAction(): void {
        const lastAction = this.ActionHistory.pop();
        if (!lastAction) { return; }

        this.Actions.unshift(lastAction);
    }

    public getChangesOnNightOver() {
        const changes: DaybreakChange[] = [];
        changes.push(...this.getVictimChanges());

        const affectedPeople: Person[] = changes.map(c => c.person);
        for (const person of affectedPeople) {
            changes.push(...this.handleConsequenceofDeath(person));
        }

        return changes;
    }

    private handleConsequenceofDeath(person: Person, isFollowUpCheck = false): DaybreakChange[] {
        const changes: (DaybreakChange | undefined)[] = [];

        changes.push(this.getLoveConnectionChanges(person));
        changes.push(this.getTrustConnectionChanges(person));

        if (!isFollowUpCheck) {
            changes.push(this.getSleepoverConnectionChanges(person));

            const followups = changes.filter(Boolean).map(c => this.handleConsequenceofDeath(c!.person, true)).flat();
            changes.push(...followups);
        }

        return changes.filter(Boolean) as DaybreakChange[];
    }

    private getVictimChanges(): DaybreakChange[] {
        const changes: DaybreakChange[] = [];
        for (const person of this.People) {
            if (person.IsVictim && !person.IsProtected) {
                changes.push({
                    person,
                    reason: ChangeReason.DiedGotKilled,
                    apply: () => {
                        person.IsVictim = false;
                        person.IsDead = true;
                    }
                });
            }
        }

        return changes;
    }

    private getSleepoverConnectionChanges(person: Person): DaybreakChange | undefined {
        const sleepoverConnection = this.Connections.find(c => c.ConnectionType === ConnectionTypes.Sleepover);
        if (sleepoverConnection?.To === person) {
            return {
                person: sleepoverConnection.From,
                reason: ChangeReason.DiedSleptWithVictim,
                apply: () => {
                    sleepoverConnection.From.IsDead = true;
                }
            };
        }
        return undefined;
    }

    private getTrustConnectionChanges(person: Person): DaybreakChange | undefined {
        const trustConnection = this.Connections.find(c => c.ConnectionType === ConnectionTypes.Trust);
        if (trustConnection?.To === person) {
            return {
                person: trustConnection.From,
                reason: ChangeReason.TurnedIntoWolf,
                apply: () => {
                    trustConnection.From.IsWerewolf = true;
                }
            };
        }
        return undefined;
    }

    private getLoveConnectionChanges(person: Person): DaybreakChange | undefined {
        const loveConnection = this.Connections.find(c => c.ConnectionType === ConnectionTypes.Love);
        if (loveConnection?.From === person || loveConnection?.To === person) {
            const affectedPerson = loveConnection.From === person ? loveConnection.To : loveConnection.From;
            return {
                person: affectedPerson,
                reason: ChangeReason.DiedOfBrokenHeart,
                apply: () => {
                    affectedPerson.IsDead = true;
                }
            };
        }

        return undefined;
    }
}
