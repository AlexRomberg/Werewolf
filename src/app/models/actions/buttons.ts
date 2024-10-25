import { DialogService } from "../../services/dialog.service";
import { Role } from "../../types";

export const RequestAssignment = (thisContext: Role) => {
    return {
        title: "Person zuweisen", action: async ({ dialog }: { dialog: DialogService }) => {
            try {
                const people = await dialog.ShowPeopleDialog("Person auswählen", 1);
                if (thisContext.AssignedPerson) {
                    thisContext.AssignedPerson.role = undefined;
                }
                thisContext.AssignedPerson = people[0];
                people[0].role = thisContext;
            } catch {
                // closed
            }
        }
    }
}

export const RequestAssignments = (thisContext: Role, maximum?: number) => {
    return {
        title: "Personen zuweisen", action: async ({ dialog }: { dialog: DialogService }) => {
            try {
                const people = await dialog.ShowPeopleDialog("Personen auswählen", maximum);
                for (const person of thisContext.AssignedPeople ?? []) {
                    person.role = undefined;
                }
                for (const person of people) {
                    person.role = thisContext;
                }
                thisContext.AssignedPeople = people;
            } catch {
                // closed
            }
        }
    }
}