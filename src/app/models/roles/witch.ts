import { DialogService } from "../../services/dialog.service";
import { Action, CirclePerson } from "../../types";
import { Role } from "./roles";

export class Witch implements Role {
    hasPositivePotion = true;
    hasNegativePotion = true;
    private assignedPerson: CirclePerson | undefined = undefined;

    public Color = "Yellow";
    public Action: Action;

    constructor() {
        const whitch = this;
        this.Action = {
            title: "The Witch",
            get points() {
                return [whitch.hasPositivePotion && "Has a saving potion", whitch.hasNegativePotion && "Has a killing potion"].filter(Boolean) as string[]
            },
            get buttons() {
                return [
                    !whitch.assignedPerson && { title: "Assign person", action: whitch.RequstAssignment.bind(whitch) },
                    whitch.hasPositivePotion && { title: "Save", action: () => { } },
                    whitch.hasNegativePotion && { title: "Kill", action: () => { } }
                ].filter(Boolean) as { title: string; action: () => void; }[]
            }
        }
    }

    IsAwakeThisNight = () => this.hasPositivePotion || this.hasNegativePotion;

    private async RequstAssignment({ dialog }: { dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Select person", 1);
            people[0].role = this;
            this.assignedPerson = people[0];
        } catch {
            // closed
        }
    }
}