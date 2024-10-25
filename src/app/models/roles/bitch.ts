import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CircleConnectionTypes, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Bitch implements Role, Action {
    public Priority = BasePriority.Initial + 11;
    public Image = "small_child";
    public Name = "Die Dorfmatratze";
    public AssignedPerson: CirclePerson | undefined;
    private lastJoinedPerson: CirclePerson | undefined;
    private isDone = false;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", !this.isDone && "Kann neues Zuhause suchen für die Nacht", this.isDone && "Ist fertig für diese Nacht"];
    GetButtons = () => {
        const buttons = [];
        if (!this.AssignedPerson) {
            buttons.push(RequestAssignment(this));
        } else if (!this.isDone) {
            buttons.push({
                title: "Gastgeber zuweisen",
                action: this.RequestHostPerson.bind(this)
            });
        }
        return buttons;
    };
    IsAwakeThisNight = () => { this.isDone = false; return true; };

    private async RequestHostPerson({ dialog, gameState }: { dialog: DialogService, gameState: GameStateService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Eine Person auswählen", 1);
            if (people[0] === this.lastJoinedPerson) {
                if (!confirm("Es darf nicht zwei mal hinter einander die gleiche Person gewählt werden. Trotzdem fortfahren?")) {
                    return;
                }
            }

            this.lastJoinedPerson = people[0];
            gameState.Connections.push({ type: CircleConnectionTypes.Sleepover, from: this.AssignedPerson!, to: people[0] });
            this.isDone = true;
        } catch {
            // closed
        }
    }
}