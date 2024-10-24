import { Role } from "./roles";

export class Judge implements Role {
    public Image = "judge";
    public Name = "Der Richter"

    IsAwakeThisNight = () => false;
}