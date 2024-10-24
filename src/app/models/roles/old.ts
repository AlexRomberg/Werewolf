import { Role } from "./roles";

export class Old implements Role {
    public Image = "old";
    public Name = "Der Alte"

    IsAwakeThisNight = () => false;
}