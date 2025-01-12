import { Action, Character, Person } from "../../types";
import { RequestAssignments } from "../actions/buttons";
import { BasePriority } from "../characters";

export class Sisters implements Character, Action {
    public Priority = BasePriority.Initial + 6;
    public Id = "sisters";
    public AssignedPeople?: Person[] | undefined;
    public IsSingle = true;

    GetPoints = () => [
        this.AssignedPeople?.length !== 2 && $localize`:@@character-button-general-assing-people:Personen zuweisen`,
        $localize`:@@character-action-sisters-2:Dürfen sich untereinander austauschen`];
    GetButtons = () => this.AssignedPeople?.length == 2 ? [] : [RequestAssignments(this, 2)];
    IsAwakeThisNight = (night: number) => night % 2 === 0;
}