import { Character } from "./models/characters/character";
import { Person as Person } from "./models/state/person";
import { DialogService } from "./services/dialog.service";
import { GameStateService } from "./services/game-state.service";

export interface iPerson {
    Id: number;
    Name: string | undefined;
    IsProtected: boolean;
    IsVictim: boolean;
    IsEnchanted: boolean;
    IsWerewolf: boolean;
    IsDead: boolean;
    Character?: iCharacter;
}

export interface Connection {
    Type: ConnectionTypes;
    From: Person;
    To: Person;
}

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

export interface iCharacter extends ActionProvider {
    Id: string;
    IsSingle: boolean;
    Group: GroupTypes;
    Game: GameSets;
    Priority?: number;
    AssignedPerson?: iPerson
    AssignedPeople?: iPerson[]
    IsAwakeThisNight: (round: number, gameState: GameStateService) => boolean;
}

export interface CharacterGroup {
    Name: string;
    Cards: CardSelectionInformation[]
}

export interface CardSelectionInformation {
    Character: Character, Selected: boolean
}
export enum BasePriority {
    Initial = 0,
    Wolf = 50,
    PostWolf = 100
}
