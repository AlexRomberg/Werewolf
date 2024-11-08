import { Action, Character } from "../../types";

export class Knight implements Character, Action {
    public Image = "knight";
    public Name = "Der Ritter der rostigen Klinge";
    public IsSingle = true;

    IsAwakeThisNight = () => false;
}