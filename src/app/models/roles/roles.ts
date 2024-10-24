import { GameStateService } from "../../services/game-state.service";
import { Action, CirclePerson } from "../../types"

export interface Role {
    Name: string;
    Image: string;
    Priority?: number;
    Action?: Action;
    IsAwakeThisNight: (nightCount: number, gameState: GameStateService) => boolean;
    AssignedPerson?: CirclePerson
    AssignedPeople?: CirclePerson[]
}

export enum BasePriority {
    Initial = 0,
    Wolf = 50,
    PostWolf = 100,
}