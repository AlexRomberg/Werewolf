import { Role } from "../../types";

export class OldMan implements Role {
    public Image = "old_man";
    public Name = "Der Verbitterte Greis"

    IsAwakeThisNight = () => false;
}