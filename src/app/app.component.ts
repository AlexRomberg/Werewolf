import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { DialogComponent } from "./components/dialog/dialog.component";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, DialogComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css"
})
export class AppComponent {
    Title = "wolf";
}
