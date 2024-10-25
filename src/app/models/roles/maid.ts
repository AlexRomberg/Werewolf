import { Role } from "../../types";

export class Maid implements Role {
    public Image = "maid";
    public Name = "Die Ergebene Magd"

    IsAwakeThisNight = () => false;
}