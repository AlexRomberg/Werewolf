import { TestBed } from "@angular/core/testing";

import { GameState } from "../../models/state/gameState";
import { Person } from "../../models/state/person";
import { Werewolf } from "../../models/characters/implementations/werewolf";
import { GameStateService } from "../../services/game-state.service";
import { Villager } from "../../models/characters/implementations/villager";
import { WildChild } from "../../models/characters/implementations/wildChild";
import { ConnectionTypes } from "../../types";

describe("GameState", () => {
    let state: GameState;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        state = new GameState();
    });

    it("should be created", () => {
        expect(state).toBeTruthy();
    });

    it("should initialize correctly", () => {
        expect(state.Round).toBe(0);
        expect(state.People.length).toBe(0);
        expect(state.SelectedCharacters.length).toBe(0);
        expect(state.Connections.size).toBe(0);
    });

    it("should serialize correctly", () => {
        const setup = [
            { name: "Alice", character: new Werewolf(undefined as any) },
            { name: "Bob", character: new Villager(undefined as any) },
            { name: "Charlie", character: new WildChild(undefined as any) }
        ]

        for (const element of setup) {
            const person = new Person();
            person.Name = element.name;
            person.Character = element.character;
            state.People.push(person);
            state.SelectedCharacters.push(element.character);
        }
        state.Round = 1;
        state.Connections.set(ConnectionTypes.Trust, { From: state.People[2], To: state.People[1] });

        const stateString = state.serialize();

        expect(stateString).toEqual(`{"round":1,"people":[{"id":"${state.People[0].Id}","name":"Alice","isProtected":false,"isVictim":false,"isEnchanted":false,"isWerewolf":false,"isDead":false,"character":"werewolf"},{"id":"${state.People[1].Id}","name":"Bob","isProtected":false,"isVictim":false,"isEnchanted":false,"isWerewolf":false,"isDead":false,"character":"villager"},{"id":"${state.People[2].Id}","name":"Charlie","isProtected":false,"isVictim":false,"isEnchanted":false,"isWerewolf":false,"isDead":false,"character":"wild_child"}],"selectedCharacters":["werewolf","villager","wild_child"],"connections":[[1,{"From":"${state.People[2].Id}","To":"${state.People[1].Id}"}]]}`);
    });

    it("should deserialize correctly", () => {
        const stateString = '{"round":1,"people":[{"id":"ea6cf25f-47f0-4aef-8676-06bf53f5b6bc","name":"Alice","isProtected":false,"isVictim":false,"isEnchanted":false,"isWerewolf":false,"isDead":false,"character":"werewolf"},{"id":"9fc1722d-0599-40aa-be01-9261d1ccc6a0","name":"Bob","isProtected":false,"isVictim":false,"isEnchanted":false,"isWerewolf":false,"isDead":false,"character":"villager"},{"id":"2911f7ac-7f7d-47a5-a23e-899264408c96","name":"Charlie","isProtected":false,"isVictim":false,"isEnchanted":false,"isWerewolf":false,"isDead":false,"character":"wild_child"}],"selectedCharacters":["werewolf","villager","wild_child"],"connections":[[1,{"From":"2911f7ac-7f7d-47a5-a23e-899264408c96","To":"9fc1722d-0599-40aa-be01-9261d1ccc6a0"}]]}';

        const state = GameState.deserialize(stateString, [new Werewolf(undefined as any), new Villager(undefined as any), new WildChild(undefined as any)]);
        expect(state.Round).toBe(1);
        expect(state.People.length).toBe(3);
        expect(state.SelectedCharacters.length).toBe(3);
        expect(state.Connections.size).toBe(1);

        const people = state.People;
        expect(people[0].Name).toBe("Alice");
        expect(people[0].Id).toBe("ea6cf25f-47f0-4aef-8676-06bf53f5b6bc");
        expect(people[0].Character).toBeInstanceOf(Werewolf);
        expect(people[1].Name).toBe("Bob");
        expect(people[1].Id).toBe("9fc1722d-0599-40aa-be01-9261d1ccc6a0");
        expect(people[1].Character).toBeInstanceOf(Villager);
        expect(people[2].Name).toBe("Charlie");
        expect(people[2].Id).toBe("2911f7ac-7f7d-47a5-a23e-899264408c96");
        expect(people[2].Character).toBeInstanceOf(WildChild);

        const connections = state.Connections;
        expect(connections.get(ConnectionTypes.Trust)?.From).toBe(people[2]);
        expect(connections.get(ConnectionTypes.Trust)?.To).toBe(people[1]);

        const selectedCharacters = state.SelectedCharacters;
        expect(selectedCharacters[0]).toBeInstanceOf(Werewolf);
        expect(selectedCharacters[1]).toBeInstanceOf(Villager);
        expect(selectedCharacters[2]).toBeInstanceOf(WildChild);
    });
});
