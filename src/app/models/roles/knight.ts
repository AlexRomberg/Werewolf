import { Role } from "./roles";

export class Knight implements Role {
    public Image = "knight";
    public Name = "Der Ritter der rostigen Klinge"

    IsAwakeThisNight = () => false;
}