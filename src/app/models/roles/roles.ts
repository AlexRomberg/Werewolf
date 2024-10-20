import { Action } from "../../types"

export interface Role {
    Color: string;
    Action: Action;
    IsAwakeThisNight: (nightCount: number) => boolean;
}