import { Role } from "./roles";

export class Maid implements Role {
    public Image = "maid";
    public Name = "Die Ergebene Magd"

    IsAwakeThisNight = () => false;
}