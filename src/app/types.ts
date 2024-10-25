import { DialogService } from "./services/dialog.service";
import { GameStateService } from "./services/game-state.service";

export interface CirclePerson {
    id: number;
    name: string | undefined;
    protected: boolean;
    victim: boolean;
    dead: boolean;
    role?: Role;
}

export interface CircleConnection {
    type: CircleConnectionTypes;
    from: CirclePerson;
    to: CirclePerson;
}

export enum CircleConnectionTypes {
    Love,
    Trust,
    Sleepover,
}

export interface Action {
    Name: string;
    Image: string;
    GetPoints?: () => (string | false)[]
    GetButtons?: () => {
        title: string
        action: ActionCallback
    }[]
}

export type ActionCallback = (services: {
    gameState: GameStateService,
    dialog: DialogService,
}) => void;

export interface Role {
    Name: string;
    Image: string;
    Priority?: number;
    Action?: Action;
    AssignedPerson?: CirclePerson
    AssignedPeople?: CirclePerson[]
    IsAwakeThisNight: (nightCount: number, gameState: GameStateService) => boolean;
}

export interface RoleGroup {
    name: string;
    cards: CardSelectionInformation[]
}

export interface CardSelectionInformation {
    role: Role, selected: boolean, multicard?: boolean
}