import { inject, Injectable } from "@angular/core";
import { StateService } from "./state.service";
import { Person } from "../models/state/person";
import { DialogData, DialogTypes } from "../types";

@Injectable({
    providedIn: "root"
})
export class DialogService {
    private gameState = inject(StateService);
    public DialogData: DialogData | undefined = undefined;

    public async ShowPersonDetailsDialog(person: Person): Promise<void> {
        return await new Promise<void>((res, rej) => {
            this.DialogData = {
                type: DialogTypes.PersonDetails,
                data: { person },
                res,
                rej
            }
        })
    }

    public async ShowPeopleSelectionDialog(title: string, numberOfPeople?: number): Promise<Person[]> {
        return await new Promise<Person[]>((res, rej) => {
            this.DialogData = {
                type: DialogTypes.PeopleSelection,
                data: {
                    title: title,
                    numberOfPeople: numberOfPeople,
                    people: this.gameState.People.map(p => p.cloneWithoutEffectState())
                },
                res,
                rej
            }
        });
    }

    public ConfirmDialog(data: Person[] | undefined = undefined) {
        if (data || this.DialogData?.type === DialogTypes.PeopleSelection) {
            this.DialogData?.res(data ?? []);
        } else {
            this.DialogData?.res();
        };
        this.DialogData = undefined;
    }
    public RejectDialog() { this.DialogData?.rej(); this.DialogData = undefined };
}
