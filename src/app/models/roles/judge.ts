import { Role } from "../../types";

export class Judge implements Role {
    public Image = "judge";
    public Name = "Der Richter"

    IsAwakeThisNight = () => false;
}