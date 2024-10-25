import { GameStateService } from "../../services/game-state.service";
import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class BigWolf implements Role {
    public Priority = BasePriority.Wolf + 4;
    public Image = "big_wolf";
    public Name = "Der Grosse, böse Wolf";
    public AssignedPerson: CirclePerson | undefined;
    public Action: Action;

    constructor() {
        const role = this;

        this.Action = {
            title: role.Name,
            image: role.Image,
            get points() { return [!role.AssignedPerson && "Person zuweisen", "Kann zweites Opfer definieren"] },
            get buttons() {
                return role.AssignedPerson ? [] : [RequestAssignment(role)]
                // TODO: Assign new target
            }
        }
    }

    IsAwakeThisNight = (night: number, gameState: GameStateService) => true;
}