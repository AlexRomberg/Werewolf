import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NarratorComponent } from "./pages/narrator/narrator.component";
import { DialogComponent } from "./components/dialog/dialog.component";
import { SpotifyComponent } from "./pages/spotify/spotify.component";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, NarratorComponent, DialogComponent, SpotifyComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css"
})
export class AppComponent {
    Title = "wolf";
}
