import { Component } from "@angular/core";
import { CircleComponent } from "../../components/circle/circle.component";
import { GameStateService } from "../../services/game-state.service";
import { DialogService } from "../../services/dialog.service";
import { Action, ActionCallback, CirclePerson } from "../../types";
import { FormsModule } from "@angular/forms";
import { SpotifyWidgetComponent } from "../../components/spotify-widget/spotify-widget.component";
import { SpotifyService } from "../../services/spotify.service";
import { environment } from "../../../environments/environment";

@Component({
    selector: "app-narrator",
    standalone: true,
    imports: [CircleComponent, FormsModule, SpotifyWidgetComponent],
    templateUrl: "./narrator.component.html",
    styleUrl: "./narrator.component.css"
})
export class NarratorComponent {
    private firstNightfall = true;
    constructor(public state: GameStateService, public dialog: DialogService, public spotify: SpotifyService) { }

    public handleAction(fn: ActionCallback) {
        fn({
            gameState: this.state,
            dialog: this.dialog
        });
    }

    public onNext() {
        if (this.spotify.IsAuthenticated && this.firstNightfall) {
            this.spotify.playPlaylist(environment.spotify.playlists.special, false, true).subscribe(() => {
                this.spotify.getPlayerState().subscribe(({ progress_ms, item: { duration_ms } }) => {
                    const remainingTime = duration_ms - progress_ms;
                    setTimeout(() => {
                        this.spotify.playPlaylist(environment.spotify.playlists.general, true, true);
                    }, remainingTime);
                });
            });
        }
        this.firstNightfall = false;
        this.state.NextAction();
    }

    async handlePersonClicked(person: CirclePerson) {
        this.dialog.ShowPersonDialog(person);
    }

    getFilteredPoints(action: Action) {
        return action.GetPoints?.().filter(Boolean) as string[] ?? [];
    }

    getFilteredButtons(action: Action) {
        return action.GetButtons?.() ?? [];
    }
}
