import { Component } from "@angular/core";
import { CircleComponent } from "../../components/circle/circle.component";
import { GameStateService } from "../../services/game-state.service";
import { DialogService } from "../../services/dialog.service";
import { Action, ActionCallback, Person } from "../../types";
import { FormsModule } from "@angular/forms";
import { SpotifyWidgetComponent } from "../../components/spotify-widget/spotify-widget.component";
import { SpotifyService } from "../../services/spotify.service";
import { environment } from "../../../environments/environment";
import { delay } from "rxjs";

@Component({
    selector: "app-narrator",
    imports: [CircleComponent, FormsModule, SpotifyWidgetComponent],
    templateUrl: "./narrator.component.html",
    styleUrl: "./narrator.component.css"
})
export class NarratorComponent {
    private firstNightfall = true;
    constructor(public state: GameStateService, public dialog: DialogService, public spotify: SpotifyService) { }

    public HandleAction(fn: ActionCallback): void {
        fn({
            GameState: this.state,
            Dialog: this.dialog
        });
    }

    public OnNext(): void {
        if (this.spotify.IsAuthenticated && this.firstNightfall) {
            this.spotify.playPlaylist(environment.spotify.playlists.special, false, true).pipe(delay(1000)).subscribe(() => {
                this.spotify.GetPlayerState().subscribe(({ progress_ms: progressMs, item }) => {
                    const remainingTime = Math.min(22_000, (item?.duration_ms ?? Number.MAX_SAFE_INTEGER) - progressMs - 500);

                    setTimeout(() => {
                        this.spotify.playPlaylist(environment.spotify.playlists.general, true, true).subscribe();
                    }, remainingTime);
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
