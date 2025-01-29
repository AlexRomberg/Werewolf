import { Character } from "./models/characters/character";
import { Person as Person } from "./models/state/person";
import { DialogService } from "./services/dialog.service";
import { GameStateService } from "./services/game-state.service";

export type Connection = { From: Person, To: Person };
export type Connections = Map<Partial<ConnectionTypes>, Connection>;

export enum ConnectionTypes {
    Love,
    Trust,
    Sleepover
}

export interface ActionProvider {
    Id: string,
    GetDescriptions: () => (string | false)[]
    GetButtons: () => ActionButton[]
}

export interface ActionButton {
    Title: string
    Action: ActionCallback
}

export type ActionCallback = (services: {
    GameState: GameStateService,
    Dialog: DialogService,
}) => void;

export enum GroupTypes {
    Wolves,
    Active,
    Passive,
    Loners
}

export enum GameSets {
    BaseGame,
    NewMoon,
    Characters,
    Special
}

export interface CharacterGroup {
    Name: string;
    Cards: Character[]
}

export enum BasePriority {
    Initial = 0,
    Wolf = 50,
    PostWolf = 100
}