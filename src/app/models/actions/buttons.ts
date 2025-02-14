import { DialogService } from "../../services/dialog.service";
import { StateService } from "../../services/state.service";
import { ActionButton } from "../../types";
import { Character } from "../characters/character";

export const RequestAssignment = (thisContext: Character): ActionButton => {
    return {
        Title: $localize`:@@character-button-general-assing-person:Person zuweisen`,
        Action: async ({ GameState, Dialog }: { GameState: StateService, Dialog: DialogService }): Promise<void> => {
            try {
                const people = await Dialog.ShowPeopleSelectionDialog($localize`:@@dialog-title-select-person:Person auswählen`, 1);
                for (const person of GameState.getPeopleForCharacter(thisContext) ?? []) {
                    person.Character = undefined;
                }
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
        Action: async ({ GameState, Dialog }: { GameState: StateService, Dialog: DialogService }): Promise<void> => {
            try {
                const people = await Dialog.ShowPeopleSelectionDialog($localize`:@@dialog-title-select-people:Personen auswählen`, maximum);
                for (const person of GameState.getPeopleForCharacter(thisContext) ?? []) {
                    person.Character = undefined;
                }
                for (const person of people) {
                    person.Character = thisContext;
                }
            } catch {
                // closed
            }
        }
    };
};