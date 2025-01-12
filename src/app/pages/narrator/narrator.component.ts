import { Component, inject } from "@angular/core";
import { CircleComponent } from "../../components/circle/circle.component";
import { GameStateService } from "../../services/game-state.service";
import { DialogService } from "../../services/dialog.service";
import { Action, ActionCallback, Person } from "../../types";
import { FormsModule } from "@angular/forms";
import { SpotifyWidgetComponent } from "../../components/spotify-widget/spotify-widget.component";
import { SpotifyService } from "../../services/spotify.service";
import { environment } from "../../../environments/environment";

@Component({
    selector: "app-narrator",
    imports: [CircleComponent, FormsModule, SpotifyWidgetComponent],
    templateUrl: "./narrator.component.html",
    styleUrl: "./narrator.component.css"
})
export class NarratorComponent {
    state = inject(GameStateService);
    dialog = inject(DialogService);
    spotify = inject(SpotifyService);

    private firstNightfall = true;

    public HandleAction(fn: ActionCallback): void {
        fn({
            GameState: this.state,
            Dialog: this.dialog
        });
    }

    public OnNext(): void {
        if (this.firstNightfall && this.spotify.IsAuthenticated && this.spotify.BackgroundMusicStarted) {
            this.spotify.Pause().then(() => {
                this.spotify.QueueSongRandom(environment.spotify.playlists.special).then(() => {
                    this.spotify.PlayPlaylist(environment.spotify.playlists.general, true).then(async () => {
                        await this.spotify.SkipSong();
                    });
                });
            });
        }
        this.firstNightfall = false;
        this.state.NextAction();
    }

    public async HandlePersonClicked(person: Person): Promise<void> {
        this.dialog.ShowPersonDialog(person);
    }

    public GetFilteredPoints(action: Action): string[] {
        return action.GetPoints?.().filter(Boolean) as string[] ?? [];
    }

    public GetFilteredButtons(action: Action): {
        Title: string;
        Action: ActionCallback;
    }[] {
        return action.GetButtons?.() ?? [];
    }
}
