import { DialogService } from "../../services/dialog.service";
import { ActionButton, Character } from "../../types";

export const RequestAssignment = (thisContext: Character): ActionButton => {
    return {
        Title: $localize`:@@character-button-general-assing-person:Person zuweisen`,
        Action: async ({ Dialog }: { Dialog: DialogService }): Promise<void> => {
            try {
                const people = await Dialog.ShowPeopleDialog($localize`:@@dialog-title-select-person:Person auswählen`, 1);
                if (thisContext.AssignedPerson) {
                    thisContext.AssignedPerson.Character = undefined;
                }
                thisContext.AssignedPerson = people[0];
                people[0].Character = thisContext;
            } catch {
                // closed
            }
        }
    };
};

export const RequestAssignments = (thisContext: Character, maximum?: number): ActionButton => {
    return {
        Title: $localize`:@@character-button-general-assing-people:Personen zuweisen`,
        Action: async ({ Dialog }: { Dialog: DialogService }): Promise<void> => {
            try {
                const people = await Dialog.ShowPeopleDialog($localize`:@@dialog-title-select-people:Personen auswählen`, maximum);
                for (const person of thisContext.AssignedPeople ?? []) {
                    person.Character = undefined;
                }
                for (const person of people) {
                    person.Character = thisContext;
                }
                thisContext.AssignedPeople = people;
            } catch {
                // closed
            }
        }
    };
};