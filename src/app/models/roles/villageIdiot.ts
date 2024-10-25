import { Action, Role } from "../../types";

export class VillageIdiot implements Role, Action {
    public Image = "village_idiot";
    public Name = "Der Dorfdepp";

    IsAwakeThisNight = () => false;
}