import { Action, Character } from "../../types";

export class WolfDog implements Character, Action {
    Id = "dog_wolf";
    IsSingle = true;

    IsAwakeThisNight = () => false;
}