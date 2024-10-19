import { Action } from "../../types";
import { Role } from "./roles";

export class Whitch implements Role {
    hasPositivePotion = true;
    hasNegativePotion = true;

    public Action: Action;

    constructor() {
        const whitch = this;
        this.Action = {
            title: "The Whitch",
            get points() {
                return [whitch.hasPositivePotion && "Has a saving potion", whitch.hasNegativePotion && "Has a killing potion"].filter(Boolean) as string[]
            },
            get buttons() {
                return [whitch.hasPositivePotion && { title: "Save", action: () => { } }, whitch.hasNegativePotion && { title: "Kill", action: () => { } }].filter(Boolean) as { title: string; action: () => void; }[]
            }
        }
    }

    IsAwakeThisNight = () => this.hasPositivePotion || this.hasNegativePotion;

}