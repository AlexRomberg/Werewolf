import { Component, inject, input } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { Device } from "@spotify/web-api-ts-sdk";
import { environment } from "../../../environments/environment";
import { LucideAngularModule } from "lucide-angular";

@Component({
    selector: "app-spotify-widget",
    imports: [LucideAngularModule],
    templateUrl: "./spotify-widget.component.html",
    styleUrl: "./spotify-widget.component.css"
})
export class SpotifyWidgetComponent {
    Spotify = inject(SpotifyService);
    WidgetState = WidgetState;
    FallbackNotPlayingText = $localize`:@@spotify-fallback-not-playing:Nichts am abspielen`;
    StartBackgroundMusicText = $localize`:@@spotify-start-background-music:Hintergrundmusik starten`;

    readonly Mode = input<"setup" | "narrator">("setup");

    public get CurrentState(): WidgetState {
        if (!this.Spotify.IsAuthenticated) {
            return WidgetState.Disconnected;
        }

        if (!this.Spotify.CurrentDevice) {
            return WidgetState.Connected;
        }

        return WidgetState.Playing;
    }

    public async TogglePlaybackState(): Promise<void> {
        if (this.Spotify.PlaybackState?.is_playing) {
            await this.Spotify.Pause();
        } else {
            await this.Spotify.Resume();
        }
        await this.Spotify.UpdatePlaybackState();
    }

    public async SkipSong(): Promise<void> {
        await this.Spotify.SkipSong();
    }

    public async Authenticate(): Promise<void> {
        await this.Spotify.Authenticate();
    }

    public Logout(): void {
        this.Spotify.Logout();
    }

    public async LoadDevices(): Promise<void> {
        await this.Spotify.UpdateDeviceList();
    }

    public async SelectDevice(device: Device): Promise<void> {
        await this.Spotify.SetDevice(device);
    }
}

export enum WidgetState {
    Disconnected,
    Connected,
    Playing,
}