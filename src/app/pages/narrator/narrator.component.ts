import { Component, inject } from "@angular/core";
import { CircleComponent } from "../../components/circle/circle.component";
import { GameStateService } from "../../services/game-state.service";
import { DialogService } from "../../services/dialog.service";
import { ActionProvider, ActionCallback, iPerson } from "../../types";
import { FormsModule } from "@angular/forms";
import { SpotifyWidgetComponent } from "../../components/spotify-widget/spotify-widget.component";
import { SpotifyService } from "../../services/spotify.service";
import { environment } from "../../../environments/environment";
import { I18nSelectPipe } from "@angular/common";
import { NAME_TRANSLATIONS } from "../../i18n/translations";
import { Person } from "../../models/state/person";

@Component({
    selector: "app-narrator",
    imports: [CircleComponent, FormsModule, SpotifyWidgetComponent, I18nSelectPipe],
    templateUrl: "./narrator.component.html",
    styleUrl: "./narrator.component.css"
})
export class NarratorComponent {
    state = inject(GameStateService);
    dialog = inject(DialogService);
    spotify = inject(SpotifyService);
    NAME_TRANSLATIONS = NAME_TRANSLATIONS;

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

    public GetFilteredPoints(action: ActionProvider): string[] {
        return action.GetDescriptions?.().filter(Boolean) as string[] ?? [];
    }

    public GetFilteredButtons(action: ActionProvider): {
        Title: string;
        Action: ActionCallback;
    }[] {
        return action.GetButtons?.() ?? [];
    }
}
