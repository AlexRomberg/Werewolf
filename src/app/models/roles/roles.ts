import { Action } from "../../types"

export interface Role {
    Name: string;
    Image: string;
    Action: Action;
    IsAwakeThisNight: (nightCount: number) => boolean;
}