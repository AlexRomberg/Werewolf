import { GameStateService } from "../../services/game-state.service";
import { Action, CirclePerson, Role } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "./roles";

export class BigWolf implements Role, Action {
    public Priority = BasePriority.Wolf + 4;
    public Image = "big_wolf";
    public Name = "Der Grosse, böse Wolf";
    public AssignedPerson: CirclePerson | undefined;

    GetPoints = () => [!this.AssignedPerson && "Person zuweisen", "Kann zweites Opfer definieren"];
    GetButtons = () => this.AssignedPerson ? [] : [RequestAssignment(this)]; // TODO: Assign new target
    IsAwakeThisNight = (night: number, gameState: GameStateService) => true;
}