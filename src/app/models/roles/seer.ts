import { DialogService } from "../../services/dialog.service";
import { Action, CirclePerson } from "../../types";
import { Role } from "./roles";

export class Seer implements Role {
    public Color = "cyan";
    private assignedPerson: CirclePerson | undefined;

    public Action: Action;

    constructor() {
        const seer = this;

        this.Action = {
            title: "🔮 The Seer",
            points: ["Need to pick a card to see"],
            get buttons() {
                if (seer.assignedPerson) {
                    return [];
                }
                return [
                    {
                        title: "Assign person", action: seer.RequstAssignment.bind(seer)
                    }
                ];
            }
        }
    }

    private async RequstAssignment({ dialog }: { dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Select person", 1);
            people[0].role = this;
            this.assignedPerson = people[0];
        } catch {
            // closed
        }
    }

    IsAwakeThisNight = () => true;

}