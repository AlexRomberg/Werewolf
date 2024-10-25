import { Action, Role } from "../../types";

export class Angel implements Role, Action {
    Image = "angel";
    Name = "Der Engel";
    IsAwakeThisNight = () => false;
}