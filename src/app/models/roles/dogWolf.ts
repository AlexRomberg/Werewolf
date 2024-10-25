import { Action, Role } from "../../types";

export class DogWolf implements Role, Action {
    public Image = "dog_wolf";
    public Name = "Der Wolfshund";

    IsAwakeThisNight = () => false;
}