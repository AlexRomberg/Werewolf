import { Component, EventEmitter, Output, input, ElementRef } from "@angular/core";
import { Connection } from "../../types";
import { Person } from "../../models/state/person";
import { PeopleCircleComponent } from "./people-circle/people-circle.component";
import { EditCircleComponent } from "./edit-circle/edit-circle.component";

@Component({
    selector: "app-circle",
    imports: [PeopleCircleComponent, EditCircleComponent],
    templateUrl: "./circle.component.html",
    styleUrl: "./circle.component.css",
})
export class CircleComponent {
    readonly Connections = input<Connection[]>([]);
    readonly People = input<Person[]>([]);
    readonly IsEditMode = input(false);

    @Output()
    PersonClick: EventEmitter<Person> = new EventEmitter<Person>();
    @Output()
    PeopleChange: EventEmitter<Person[]> = new EventEmitter<Person[]>();

    constructor(public host: ElementRef<HTMLDivElement>) { }

    public onPersonClicked(person: Person) {
        this.PersonClick.emit(person);
    }

    public onPeopleChanged(people: Person[]) {
        this.PeopleChange.emit(people);
    }
}