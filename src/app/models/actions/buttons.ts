import { DialogService } from "../../services/dialog.service";
import { ActionButton, Character } from "../../types";

export const RequestAssignment = (thisContext: Character): ActionButton => {
    return {
        Title: "Person zuweisen",
        Action: async ({ Dialog }: { Dialog: DialogService }): Promise<void> => {
            try {
                const people = await Dialog.ShowPeopleDialog("Person auswählen", 1);
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
        Title: "Personen zuweisen",
        Action: async ({ Dialog }: { Dialog: DialogService }): Promise<void> => {
            try {
                const people = await Dialog.ShowPeopleDialog("Personen auswählen", maximum);
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