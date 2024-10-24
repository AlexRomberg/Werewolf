import { Role } from "./roles";

export class Hunter implements Role {
    public Image = "hunter";
    public Name = "Der Jäger"

    IsAwakeThisNight = () => false;
}