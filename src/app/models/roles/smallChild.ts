import { Role } from "../../types";

export class SmallChild implements Role {
    public Image = "small_child";
    public Name = "Das kleine Mädchen"

    IsAwakeThisNight = () => false;
}