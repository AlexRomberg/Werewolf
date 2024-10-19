import { Action } from "../../types"

export interface Role {
    Action: Action
    IsAwakeThisNight: (nightCount: number) => boolean
}