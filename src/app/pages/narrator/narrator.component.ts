import { Component, inject } from "@angular/core";
import { CircleComponent } from "../../components/circle/circle.component";
import { StateService } from "../../services/state.service";
import { DialogService } from "../../services/dialog.service";
import { ActionProvider, ActionCallback } from "../../types";
import { FormsModule } from "@angular/forms";
import { SpotifyService } from "../../services/spotify.service";
import { environment } from "../../../environments/environment";
import { I18nSelectPipe } from "@angular/common";
import { NAME_TRANSLATIONS } from "../../i18n/translations";
import { Person } from "../../models/state/person";
import { LucideAngularModule } from "lucide-angular";
import { SidebarGroupComponent } from "./sidebar-group/sidebar-group.component";
import { Router } from "@angular/router";

@Component({
    selector: "app-narrator",
    imports: [CircleComponent, FormsModule, I18nSelectPipe, LucideAngularModule, SidebarGroupComponent],
    templateUrl: "./narrator.component.html",
    styleUrl: "./narrator.component.css"
})
export class NarratorComponent {
    state = inject(StateService);
    dialog = inject(DialogService);
    spotify = inject(SpotifyService);
    NAME_TRANSLATIONS = NAME_TRANSLATIONS;
    FallbackNotPlayingText = $localize`:@@spotify-fallback-not-playing:Nichts am abspielen`;
    IsEditingPlayers = false;
    AreEventsMaximized = false;

    private router = inject(Router);
    private firstNightfall = true;

    public HandleAction(fn: ActionCallback): void {
        fn({
            GameState: this.state,
            Dialog: this.dialog
        });
    }

    public OnNext(): void {
        if (this.firstNightfall && this.spotify.IsAuthenticated && this.state.MusicStarted) {
            this.spotify.Pause().then(() => {
                this.spotify.QueueSongRandom(environment.spotify.playlists.special).then(() => {
                    this.spotify.PlayPlaylist(environment.spotify.playlists.general, true).then(async () => {
                        await this.spotify.SkipSong();
                    });
                });
            });
        }
        this.firstNightfall = false;
        this.state.nextAction();
    }

    public async HandlePersonClicked(person: Person): Promise<void> {
        this.dialog.ShowPersonDetailsDialog(person);
    }

    public GetFilteredPoints(action: ActionProvider): string[] {
        return action.GetActions?.().filter(Boolean) as string[] ?? [];
    }

    public GetFilteredButtons(action: ActionProvider): {
        Title: string;
        Action: ActionCallback;
    }[] {
        return action.GetButtons?.() ?? [];
    }

    public async togglePlaybackState(): Promise<void> {
        if (this.spotify.PlaybackState?.is_playing) {
            await this.spotify.Pause();
        } else {
            await this.spotify.Resume();
        }
        await this.spotify.UpdatePlaybackState();
    }

    public async skipSong(): Promise<void> {
        await this.spotify.SkipSong();
    }

    public get songTitle(): string {
        return this.spotify.PlaybackState?.item?.name ?? this.FallbackNotPlayingText;
    }

    public get spotifySummary(): string {
        return this.spotify.CurrentDevice?.name + ": " + this.songTitle;
    }

    public goBack(): void {
        this.dialog.ShowConfirmDialog($localize`:@@leave-game-question:Willst du wirklich das Spiel verlassen?`).then((response) => {
            if (response) {
                this.router.navigate(["/setup"]);
            }
        });
    }

    public isRoleInGame(role: string): boolean {
        return this.state.SelectedCharacters.some(c => c.Id === role);
    }

    public getNextActions() {
        return this.state.Actions.slice(1);
    }
}
