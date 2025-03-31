import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { DefaultResponseDeserializer, Device, PlaybackState, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { StateService } from "./state.service";

const BROKEN_URLS = [
    "me/player/shuffle",
    "me/player/repeat",
    "me/player/pause",
    "me/player/play",
    "me/player/next",
    "me/player/queue"
];

@Injectable({
    providedIn: "root"
})
export class SpotifyService {
    private sdk: SpotifyApi;
    private state = inject(StateService);

    private clientId = environment.spotify.clientId;
    private redirectUri = environment.spotify.redirectUri;

    public IsAuthenticated = false;
    public AvailableDevices: Device[] = [];
    public CurrentDevice: Device | null = null;
    public PlaybackState: PlaybackState | null = null;

    constructor() {
        this.sdk = SpotifyApi.withUserAuthorization(this.clientId, this.redirectUri, [
            "user-read-playback-state",
            "user-modify-playback-state",
            "playlist-read-private"
        ], {
            deserializer: {
                deserialize: async <T>(response: Response) => {
                    // HACK: Current version of the SDK doesn't handle non json responses correctly
                    if (response.ok && BROKEN_URLS.some(broken_url => response.url.includes(broken_url))) {
                        return {} as T;
                    }

                    return new DefaultResponseDeserializer().deserialize(response);
                }
            },
        });

        this.sdk.getAccessToken().then((token) => {
            this.IsAuthenticated = Boolean(token);
            if (this.IsAuthenticated) {
                this.startPlaybackUpdater();

                this.UpdateDeviceList();
                if (this.state.CurrentDeviceId) {
                    this.UpdateDeviceList().then(() => {
                        this.SetDevice(this.state.CurrentDeviceId, undefined);
                    });
                }
            }

        });
    }

    private startPlaybackUpdater() {
        const int = setInterval(async () => {
            if (!this.IsAuthenticated || !this.CurrentDevice) {
                clearInterval(int);
                return;
            }

            if (this.IsAuthenticated && this.CurrentDevice && this.state.MusicStarted) {
                await this.UpdatePlaybackState();
                if (this.PlaybackState?.progress_ms && this.PlaybackState?.item?.duration_ms) {
                    const remainingTime = this.PlaybackState.item.duration_ms - this.PlaybackState.progress_ms;

                    if ((remainingTime + 500) < 10000) {
                        setTimeout(async () => {
                            await this.UpdatePlaybackState();
                        }, remainingTime + 500);
                    }
                }
            }
        }, 10_000);
    }

    public async Authenticate() {
        return this.sdk.authenticate();
    }

    public async UpdateAuthenticationState() {
        try {
            const profile = await this.sdk.currentUser.profile();
            this.IsAuthenticated = Boolean(profile);

            if (this.IsAuthenticated) {
                this.startPlaybackUpdater();
                this.UpdateDeviceList();
            }
        } catch {
            this.IsAuthenticated = false;
        }
        return this.IsAuthenticated;
    }

    public Logout() {
        this.sdk.logOut();
        this.IsAuthenticated = false;
    }

    public async UpdateDeviceList() {
        if (!this.checkAuthentication()) {
            return;
        }

        try {
            this.AvailableDevices = (await this.sdk.player.getAvailableDevices()).devices;
        } catch (error) {
            console.error(error);
            this.AvailableDevices = [];
        }
    }

    public async SetDevice(deviceId: string | undefined, play: boolean | undefined) {
        if (!this.checkCurrentDevice(deviceId) || !this.checkAuthentication()) {
            return;
        }

        await this.sdk.player.transferPlayback([deviceId], play);
        this.CurrentDevice = this.AvailableDevices.find(device => device.id === deviceId) ?? null;
        this.state.CurrentDeviceId = deviceId;

        await this.UpdatePlaybackState();
    }

    public async UpdatePlaybackState() {
        if (!this.checkAuthentication()) {
            return;
        }

        try {
            this.PlaybackState = (await this.sdk.player.getPlaybackState());
        } catch (error) {
            console.error(error);
            this.PlaybackState = null;
        }
    }

    public async PlayPlaylist(playlist: string, shuffle = true) {
        if (!this.checkCurrentDevice(this.CurrentDevice?.id) || !this.checkAuthentication()) {
            return;
        }

        await this.sdk.player.setRepeatMode("context", this.CurrentDevice.id!);
        await this.sdk.player.togglePlaybackShuffle(shuffle, this.CurrentDevice.id!);
        await this.sdk.player.startResumePlayback(this.CurrentDevice.id!, `spotify:playlist:${playlist}`);
        await this.UpdatePlaybackState();
    }

    public async Pause() {
        if (!this.checkCurrentDevice(this.CurrentDevice?.id) || !this.checkAuthentication()) {
            return;
        }

        await this.sdk.player.pausePlayback(this.CurrentDevice.id!);
    }

    public async Resume() {
        if (!this.checkCurrentDevice(this.CurrentDevice?.id) || !this.checkAuthentication()) {
            return;
        }

        await this.sdk.player.startResumePlayback(this.CurrentDevice.id!);
    }

    public async SkipSong() {
        if (!this.checkCurrentDevice(this.CurrentDevice?.id) || !this.checkAuthentication()) {
            return;
        }

        await this.sdk.player.skipToNext(this.CurrentDevice.id!);
    }

    public async QueueSongRandom(playlist: string) {
        if (!this.checkCurrentDevice(this.CurrentDevice?.id) || !this.checkAuthentication()) {
            return;
        }

        const tracks = (await this.sdk.playlists.getPlaylistItems(playlist)).items;
        const track = tracks[Math.floor(Math.random() * tracks.length)].track;
        await this.sdk.player.addItemToPlaybackQueue(track.uri, this.CurrentDevice.id!);
    }

    public getIconOfDevice(device: Device): string {
        switch (device.type.toLowerCase()) {
            case "computer": return "laptop";
            case "smartphone": return "smartphone";
            case "tablet": return "tablet";
            case "tv": return "tv";
            case "automobile": return "car-front";
            default: return "speaker";
        }
    }

    private checkAuthentication() {
        if (!this.IsAuthenticated) {
            this.CurrentDevice = null;
            this.state.CurrentDeviceId = undefined;
            this.state.MusicStarted = false;
            return false;
        }
        return true;
    }

    private checkCurrentDevice(currentDeviceId: string | null | undefined): currentDeviceId is string {
        if (!currentDeviceId) {
            this.CurrentDevice = null;
            this.state.CurrentDeviceId = undefined;
            this.state.MusicStarted = false;
            return false;
        }
        return true;
    }
}
