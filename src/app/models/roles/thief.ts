import { DialogService } from "../../services/dialog.service";
import { Action, CirclePerson } from "../../types";
import { Role } from "./roles";

export class Thief implements Role {
    public Image = "thief";
    public Name = "The thief"
    private assignedPerson: CirclePerson | undefined = undefined;

    public Action: Action;

    constructor() {
        const thief = this;

        this.Action = {
            title: thief.Name,
            get points() { return ["Needs to exchange two cards", !thief.assignedPerson && "Needs to be assigned"] },
            get buttons() {
                const buttons = [];
                if (!thief.assignedPerson) {
                    buttons.push({
                        title: "Assign person", action: thief.RequstAssignment.bind(thief)
                    });
                }
                return buttons;
            }
        }
    }

    private async RequstAssignment({ dialog }: { dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Select person", 1);
            if (this.assignedPerson) {
                this.assignedPerson.role = undefined;
            }
            people[0].role = this;
            this.assignedPerson = people[0];
        } catch {
            // closed
        }
    }

    IsAwakeThisNight = (night: number) => night === 0;

}