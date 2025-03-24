import { Character } from "./models/characters/character";
import { Person as Person } from "./models/state/person";
import { DialogService } from "./services/dialog.service";
import { StateService } from "./services/state.service";

export type Connection = { ConnectionType: ConnectionTypes, From: Person, To: Person };
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
    GameState: StateService,
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

export enum ChangeReason {
    DiedGotKilled,
    DiedSleptWithVictim,
    DiedOfBrokenHeart,
    TurnedIntoWolf,
}

export interface DaybreakChange {
    person: Person,
    reason: ChangeReason,
    apply: () => void
}

export interface AppState {
    inGame: boolean,
    spotify: {
        currentDevice: string | undefined,
        musicStarted: boolean,
    }
}

export interface State {
    app: {
        inGame: boolean,
    },
    game: {
        round: number,
        people: Person[],
        selectedCharacters: Character[],
        connections: Connections
    },
    music: {
        currentDevice: string | undefined,
        musicStarted: boolean,
    }
}

export interface Point {
    x: number,
    y: number
}

export enum DialogTypes {
    PeopleSelection,
    PersonDetails,
    Confirm
}

export interface PeopleSelectionDialogData {
    title: string,
    numberOfPeople: number | undefined,
    people: Person[]
}

export interface PersonDetailsDialogData {
    person: Person
}

export interface ConfirmDialogData {
    title: string,
}

export type DialogData = {
    type: DialogTypes.PeopleSelection,
    data: PeopleSelectionDialogData,
    res: (people: Person[]) => void,
    rej: () => void
} | {
    type: DialogTypes.PersonDetails,
    data: PersonDetailsDialogData,
    res: () => void,
    rej: () => void
} | {
    type: DialogTypes.Confirm,
    data: ConfirmDialogData,
    res: (response: boolean) => void,
    rej: () => void
}