import { Action, Character, Person } from "../../types";
import { RequestAssignments } from "../actions/buttons";
import { BasePriority } from "../characters";

export class Brothers implements Character, Action {
    Priority = BasePriority.Initial + 7;
    Id = "brothers";
    IsSingle = false;
    AssignedPeople?: Person[] | undefined;

    GetPoints = () => [
        this.AssignedPeople?.length !== 3 && $localize`:@@character-button-general-assing-people:Personen zuweisen`,
        $localize`:@@character-action-brothers-2:Dürfen sich untereinander austauschen`];
    GetButtons = () => this.AssignedPeople?.length === 3 ? [] : [RequestAssignments(this, 3)];
    IsAwakeThisNight = (night: number) => night % 2 === 0;
}