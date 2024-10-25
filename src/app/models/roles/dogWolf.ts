import { Role } from "../../types";

export class DogWolf implements Role {
    public Image = "dog_wolf";
    public Name = "Der Wolfshund";

    IsAwakeThisNight = () => false;
}