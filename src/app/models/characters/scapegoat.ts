import { Action, Character, Person } from "../../types";
import { RequestAssignment } from "../actions/buttons";
import { BasePriority } from "../characters";

export class Scapegoat implements Character, Action {
    public Priority = BasePriority.Initial + 12;
    public Id = "scapegoat";
    public AssignedPerson?: Person | undefined;
    public IsSingle = true;

    GetPoints = () => [
        !this.AssignedPerson && $localize`:@@character-button-general-assing-person:Person zuweisen`,
        $localize`:@@character-action-scapegoat-2:Kann direkt wieder schlafen gehen`,
        $localize`:@@character-action-scapegoat-3:Wird bei unentschieden in Abstimmungen gewählt`];
    GetButtons = () => this.AssignedPerson ? [] : [RequestAssignment(this)];
    IsAwakeThisNight = (night: number) => night <= 0;
}