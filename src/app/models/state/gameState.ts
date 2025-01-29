import { Connection, Connections, ConnectionTypes } from "../../types";
import { Character } from "../characters/character";
import { Person } from "./person";

export class GameState {
    private round: number = 0;
    private people: Person[] = [];
    private selectedCharacters: Character[] = [];
    private connections: Connections = new Map();

    get Round(): number { return this.round; }
    set Round(value: number) {
        this.round = value;
        this.onChanged();
    }

    get People(): Person[] { return this.people; }
    set People(value: Person[]) {
        this.people = value;
        this.onChanged();
    }

    get SelectedCharacters(): Character[] { return this.selectedCharacters; }
    set SelectedCharacters(value: Character[]) {
        this.selectedCharacters = value;
        this.onChanged();
    }

    get Connections(): Connections { return this.connections; }
    set Connections(value: Connections) {
        this.connections = value;
        this.onChanged();
    }

    constructor(private onChanged = () => { }) { }

    serialize(): string {
        return JSON.stringify({
            round: this.round,
            people: this.people.map(p => p.asSerializeable()),
            selectedCharacters: this.selectedCharacters.map(c => c.Id),
            connections: Array.from(this.connections.entries()).map<[Partial<ConnectionTypes>, Partial<{ From: string | undefined, To: string | undefined }>]>(([key, value]) => [key, { From: value.From?.Id, To: value.To?.Id }]).filter(([_, value]) => value.From && value.To)
        });
    }

    static deserialize(data: string | null, allCharacters: Character[], onChanged: () => void = () => { }): GameState {
        const state = new GameState(onChanged);
        if (data) {
            const obj = JSON.parse(data, (key, value) => {
                if (key === "character") {
                    return allCharacters.find(c => c.Id === value);
                } else if (key === "people") {
                    return value.map((p: any) => Person.fromSerializeable(p, onChanged));
                } else if (key === "selectedCharacters") {
                    return value.map((id: string) => allCharacters.find(c => c.Id === id));
                }

                return value;
            });

            state.round = obj.round;
            state.people = obj.people;
            state.selectedCharacters = obj.selectedCharacters;
            for (const connection of obj.connections ?? []) {
                state.connections.set(connection[0], { From: obj.people.find((p: Person) => p.Id === connection[1].From), To: obj.people.find((p: Person) => p.Id === connection[1].To) });
            }
        }
        return state;
    }

    reset(selectedCharacters: Character[]): void {
        this.round = 0;
        this.connections = new Map();
        for (const person of this.people) {
            person.resetPerson();
        }
        this.selectedCharacters = selectedCharacters;
        this.onChanged();
    }
}