import { Connection, Connections, ConnectionTypes } from "../../types";
import { Character } from "../characters/character";
import { Person } from "./person";

export class GameState {
    private round: number = 0;
    private people: Person[] = [];
    private selectedCharacters: Character[] = [];
    private connections: Connection[] = [];
    // private connections: Connections = new Map();

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

    get Connections(): Connection[] { return this.connections; }
    set Connections(value: Connection[]) {
        this.connections = value;
        this.onChanged();
    }

    constructor(private onChanged = () => { }) { }

    serialize(): string {
        return JSON.stringify({
            round: this.round,
            people: this.people.map(p => p.asSerializeable()),
            selectedCharacters: this.selectedCharacters.map(c => c.Id),
            connections: this.connections.map((c) => ({ ...c, From: c.From.Id, To: c.To.Id }))
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
            state.connections = (obj.connections ?? []).map((c: any) => ({
                ConnectionType: c?.ConnectionType ?? ConnectionTypes.Love,
                From: obj.people.find((p: Person) => p.Id === c?.From),
                To: obj.people.find((p: Person) => p.Id === c?.To)
            })).filter((c: Connection) => c.From && c.To);
        }
        return state;
    }

    reset(selectedCharacters: Character[]): void {
        this.round = 0;
        this.connections = [];
        for (const person of this.people) {
            person.resetPerson();
        }
        this.selectedCharacters = selectedCharacters;
        this.onChanged();
    }
}