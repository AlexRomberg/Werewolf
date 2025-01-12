import { Action, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "../characters";

export class Thief implements Character, Action {
    public Priority = BasePriority.Initial + 1;
    public Id = "thief";
    public AssignedPerson: Person | undefined;
    public IsSingle = true;

    GetPoints = () => [
        $localize`:@@character-action-thief-1:Muss Karten tauschen`,
        !this.AssignedPerson && $localize`:@@character-button-general-assing-person:Person zuweisen`];
    GetButtons = () => this.AssignedPerson ? [] : [RequestAssignment(this)];
    IsAwakeThisNight = (night: number) => night === 0;

}