import { DialogService } from "./services/dialog.service";
import { GameStateService } from "./services/game-state.service";

export interface Person {
    Id: number;
    Name: string | undefined;
    IsProtected: boolean;
    IsVictim: boolean;
    IsEnchanted: boolean;
    IsWerewolf: boolean;
    IsDead: boolean;
    Character?: Character;
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

export interface Action {
    Name: string;
    Image: string;
    GetPoints?: () => (string | false)[]
    GetButtons?: () => ActionButton[]
}

export interface ActionButton {
    Title: string
    Action: ActionCallback
}

export type ActionCallback = (services: {
    GameState: GameStateService,
    Dialog: DialogService,
}) => void;

export interface Character {
    Name: string;
    Image: string;
    IsSingle: boolean;
    Priority?: number;
    Action?: Action;
    AssignedPerson?: Person
    AssignedPeople?: Person[]
    IsAwakeThisNight: (nightCount: number, gameState: GameStateService) => boolean;
}

export interface CharacterGroup {
    Name: string;
    Cards: CardSelectionInformation[]
}

export interface CardSelectionInformation {
    Character: Character, Selected: boolean, Multicard?: boolean
}