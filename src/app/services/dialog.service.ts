import { inject, Injectable } from "@angular/core";
import { Person } from "../types";
import { GameStateService } from "./game-state.service";

@Injectable({
    providedIn: "root"
})
export class DialogService {
    private gameState = inject(GameStateService);

    public PeopleDialog: {
        Title: string, NumberOfPeople?: number, People: Person[]
    } | undefined;
    public PersonDialog: {
        Person: Person
    } | undefined;

    public async ShowPersonDialog(person: Person): Promise<void> {
        this.PersonDialog = { Person: person };
    }

    public async ShowPeopleDialog(title: string, numberOfPeople?: number): Promise<Person[]> {
        return await new Promise<Person[]>((res, rej) => {
            this.peopleDialogCallback = res;
            this.peopleDialogRejection = rej;
            this.PeopleDialog = { Title: title, NumberOfPeople: numberOfPeople, People: this.gameState.People.map(p => ({ ...p, protected: false })) };
        });
    }

    public SetPersonState(state: "protected" | "victim" | "nothing"): void {
        if (!this.PersonDialog) {
            return;
        }
        this.PersonDialog.Person.IsProtected = state === "protected";
        this.PersonDialog.Person.IsVictim = state === "victim";
    }

    public PeopleDialogSelectionValid(): boolean {
        if (!this.PeopleDialog?.NumberOfPeople) {
            return true;
        }
        return this.PeopleDialog?.People.filter(p => p.IsProtected).length === this.PeopleDialog.NumberOfPeople;
    }

    public OnPersonSelected(person: Person): void {
        if (this.PeopleDialog && this.PeopleDialog.NumberOfPeople === 1) {
            this.PeopleDialog.People.forEach(p => p.IsProtected = false);
        }

        person.IsProtected = !person.IsProtected;
    }

    public ApplyPeopleDialog(): void {
        if (!this.PeopleDialog) {
            return;
        }
        this.peopleDialogCallback(this.PeopleDialog.People.filter(p => p.IsProtected).map(f => this.gameState.People.find(p => p.Id === f.Id)!).filter(Boolean));
        this.PeopleDialog = undefined;
    }

    public QuitPeopleDialog(): void {
        if (!this.PeopleDialog) {
            return;
        }
        this.PeopleDialog = undefined;
        this.peopleDialogRejection();
    }

    public QuitPersonDialog(): void {
        this.PersonDialog = undefined;
    }

    private peopleDialogCallback: (people: Person[]) => void = () => { return; };
    private peopleDialogRejection: () => void = () => { return; };
}
