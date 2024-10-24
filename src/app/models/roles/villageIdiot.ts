import { Role } from "./roles";

export class VillageIdiot implements Role {
    public Image = "village_idiot";
    public Name = "Der Dorfdepp"

    IsAwakeThisNight = () => false;
}