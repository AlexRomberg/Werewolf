import { inject, Injectable } from "@angular/core";
import { StateService } from "./state.service";
import { Person } from "../models/state/person";
import { DaybreakChange, DialogData, DialogTypes } from "../types";
import { Character } from "../models/characters/character";

@Injectable({
    providedIn: "root"
})
export class DialogService {
    private gameState = inject(StateService);
    public DialogData: DialogData | undefined = undefined;

    public async ShowPersonDetailsDialog(person: Person) {
        return await new Promise<void>((res, rej) => {
            this.DialogData = {
                type: DialogTypes.PersonDetails,
                data: { person },
                res,
                rej
            }
        })
    }

    public async ShowCharacterDetailsDialog(character: Character) {
        return await new Promise<void>((res, rej) => {
            this.DialogData = {
                type: DialogTypes.CharacterDetails,
                data: { character },
                res,
                rej
            }
        })
    }

    public async ShowPeopleSelectionDialog(title: string, numberOfPeople?: number, selectedPeople?: Person[]) {
        const peopleClone: Person[] = this.gameState.People.map(p => p.cloneWithoutEffectState());
        const selectedIds = (selectedPeople ?? []).map(p => p.Id);
        const selectedPeopleClone = peopleClone.map((p: Person) => { p.IsProtected = selectedIds.includes(p.Id); return p; });

        return await new Promise<Person[]>((res, rej) => {
            this.DialogData = {
                type: DialogTypes.PeopleSelection,
                data: {
                    title,
                    numberOfPeople,
                    people: selectedPeopleClone
                },
                res,
                rej
            }
        });
    }

    public async ShowConfirmDialog(title: string) {
        return await new Promise<boolean>((res, rej) => {
            this.DialogData = {
                type: DialogTypes.Confirm,
                data: { title },
                res,
                rej
            }
        });
    }

    public async ShowChangesDialog(changes: DaybreakChange[]) {
        return await new Promise<void>((res, rej) => {
            this.DialogData = {
                type: DialogTypes.Changes,
                data: changes,
                res,
                rej
            }
        });
    }

    public ConfirmDialog(data: any = undefined) {
        if (this.DialogData?.type === DialogTypes.PeopleSelection) {
            this.DialogData?.res((data ?? []).map((p: Person) => this.gameState.People.find(gp => gp.Id === p.Id)!));
        } else if (this.DialogData?.type === DialogTypes.Confirm) {
            this.DialogData.res(Boolean(data));
        } else {
            this.DialogData?.res();
        }
        this.DialogData = undefined;
    }

    public RejectDialog() { this.DialogData?.rej(); this.DialogData = undefined };
}
