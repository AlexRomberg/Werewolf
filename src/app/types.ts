import { Role } from "./models/roles/roles";
import { DialogService } from "./services/dialog.service";
import { GameStateService } from "./services/game-state.service";

export interface CirclePerson {
    id: number;
    name: string | undefined;
    protected: boolean;
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
    title: string;
    points: string[];
    buttons: {
        title: string
        action: ActionCallback
    }[],
    onNext?: ActionCallback
}

export type ActionCallback = (services: {
    gameState: GameStateService,
    dialog: DialogService,
}) => void;