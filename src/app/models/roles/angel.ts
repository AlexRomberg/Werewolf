import { Role } from "../../types";

export class Angel implements Role {
    public Image = "angel";
    public Name = "Der Engel"

    IsAwakeThisNight = () => false;
}