import { Injectable } from "@angular/core";
import { CirclePerson } from "../types";
import { GameStateService } from "./game-state.service";

@Injectable({
    providedIn: "root"
})
export class DialogService {
    public peopleDialog: {
        title: string, numberOfPeople?: number, people: CirclePerson[]
    } | undefined;
    public personDialog: {
        person: CirclePerson
    } | undefined;

    constructor(private gameState: GameStateService) { }

    public async ShowPersonDialog(person: CirclePerson) {
        this.personDialog = { person };
    }

    public async ShowPeopleDialog(title: string, numberOfPeople?: number) {
        return await new Promise<CirclePerson[]>((res, rej) => {
            this.peopleDialogCallback = res;
            this.peopleDialogRejection = rej;
            this.peopleDialog = { title, numberOfPeople, people: this.gameState.People.map(p => ({ ...p, protected: false })) };
        });
    }

    public SetPersonState(state: "protected" | "victim" | "nothing") {
        if (!this.personDialog) {
            return;
        }
        this.personDialog.person.protected = state === "protected";
        this.personDialog.person.victim = state === "victim";
    }

    public PeopleDialogSelectionValid() {
        if (!this.peopleDialog?.numberOfPeople) {
            return true;
        }
        return this.peopleDialog?.people.filter(p => p.protected).length === this.peopleDialog.numberOfPeople;
    }

    public OnPersonSelected(person: CirclePerson) {
        if (this.peopleDialog && this.peopleDialog.numberOfPeople === 1) {
            this.peopleDialog.people.forEach(p => p.protected = false);
        }

        person.protected = !person.protected;
    }

    public ApplyPeopleDialog() {
        if (!this.peopleDialog) {
            return;
        }
        this.peopleDialogCallback(this.peopleDialog.people.filter(p => p.protected).map(f => this.gameState.People.find(p => p.id === f.id)!).filter(Boolean));
        this.peopleDialog = undefined;
    }

    public QuitPeopleDialog() {
        if (!this.peopleDialog) {
            return;
        }
        this.peopleDialog = undefined;
        this.peopleDialogRejection();
    }

    public QuitPersonDialog() {
        this.personDialog = undefined;
    }

    private peopleDialogCallback: (people: CirclePerson[]) => void = () => { return; };
    private peopleDialogRejection = () => { return; };
}
