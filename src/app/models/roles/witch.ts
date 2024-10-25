import { DialogService } from "../../services/dialog.service";
import { GameStateService } from "../../services/game-state.service";
import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class Witch implements Role {
    public Priority = BasePriority.PostWolf + 1;
    public Image = "witch";
    public Name = "Die Hexe";
    public AssignedPerson: CirclePerson | undefined;
    public Action: Action;

    private hasPositivePotion = true;
    private hasNegativePotion = true;

    constructor() {
        const role = this;
        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() {
                return [
                    !role.AssignedPerson && "Person zuweisen",
                    (!role.hasPositivePotion && !role.hasNegativePotion) && "Hat keinen Zaubertrank mehr.",
                    role.hasPositivePotion && "Kann einen Heiltrank einsetzen",
                    role.hasNegativePotion && "Kann einen Gifttrank einsetzen"
                ]
            },
            get buttons() {
                const buttons = [];
                if (!role.AssignedPerson) {
                    buttons.push(RequestAssignment(role));
                }
                if (role.hasPositivePotion) {
                    buttons.push({ title: "Retten", action: role.RequstSave.bind(role) })
                }
                if (role.hasNegativePotion) {
                    buttons.push({ title: "Person vergiften", action: role.RequstKill.bind(role) })
                }
                return buttons;
            }
        }
    }

    private async RequstSave({ gameState, dialog }: { gameState: GameStateService, dialog: DialogService }) {
        try {
            const victims = gameState.People.filter(p => p.victim);
            const people = await dialog.ShowPeopleDialog("Wähle das Opfer aus", 1);
            if (!victims.includes(people[0])) {
                return;
            }
            people[0].victim = false;
            this.hasPositivePotion = false;
        } catch {
            // closed
        }
    }

    private async RequstKill({ dialog }: { dialog: DialogService }) {
        try {
            const people = await dialog.ShowPeopleDialog("Wähle das Opfer aus", 1);
            if (people[0].victim) {
                return;
            }
            people[0].victim = true;
            this.hasNegativePotion = false;
        } catch {
            // closed
        }
    }

    IsAwakeThisNight = () => this.hasPositivePotion || this.hasNegativePotion;
}