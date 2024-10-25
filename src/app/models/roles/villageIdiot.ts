import { Role } from "../../types";

export class VillageIdiot implements Role {
    public Image = "village_idiot";
    public Name = "Der Dorfdepp"

    IsAwakeThisNight = () => false;
}