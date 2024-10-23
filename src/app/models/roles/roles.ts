import { Action } from "../../types"

export interface Role {
    Name: string;
    Color: string;
    Action: Action;
    IsAwakeThisNight: (nightCount: number) => boolean;
}