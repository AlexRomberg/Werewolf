import { Action, Role } from "../../types";

export class SmallChild implements Role, Action {
    public Image = "small_child";
    public Name = "Das kleine Mädchen";

    IsAwakeThisNight = () => false;
}