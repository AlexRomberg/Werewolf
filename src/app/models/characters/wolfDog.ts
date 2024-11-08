import { Action, Character } from "../../types";

export class WolfDog implements Character, Action {
    Image = "dog_wolf";
    Name = "Der Wolfshund";
    IsSingle = true;

    IsAwakeThisNight = () => false;
}