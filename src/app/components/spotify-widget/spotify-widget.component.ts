import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { NgIconComponent } from "@ng-icons/core";
import { BehaviorSubject, interval, merge, Subscription, switchMap, tap, timer } from "rxjs";

@Component({
    selector: "app-spotify-widget",
    imports: [NgIconComponent],
    templateUrl: "./spotify-widget.component.html",
    styleUrl: "./spotify-widget.component.css"
})
export class SpotifyWidgetComponent implements OnInit, OnDestroy {
    Title = "Nichts am abspielen";
    IsPlaying = false;
    Link = "";
    @Input() Mode: "setup" | "narrator" = "setup";

    private forceRefresh$ = new BehaviorSubject<Date>(new Date());
    private subscription: Subscription = new Subscription();
    private informedAboutPrivateSession = false;

    constructor(public Spotify: SpotifyService) { }

    async ngOnInit(): Promise<void> {
        this.Link = await this.Spotify.GetAccountConnectionLink();
        const tenSecondsInterval$ = interval(10000);
        const refresh$ = merge(tenSecondsInterval$, this.forceRefresh$);

        this.subscription = refresh$
            .pipe(
                switchMap(() => this.Spotify.GetPlayerState()),
                tap((data) => {
                    if (!data || !("item" in data && "is_playing" in data && "progress_ms" in data) || !data.item) {
                        if (!this.informedAboutPrivateSession && data?.device?.is_private_session) {
                            this.informedAboutPrivateSession = true;
                            alert("Dein Spotify scheint in einer Private Session zu laufen. So kann die Companion App deine Musik nicht steuern. Bitte schalte die Private Session aus oder melde dich hier von Spotify ab.");
                        }
                        return;
                    }

                    const { item, is_playing: isPlaying, progress_ms: progressMs } = data;
                    this.Title = item?.name + " - " + item?.artists?.map(a => a.name).join(", ");
                    this.IsPlaying = isPlaying;
                    const timeLeft = (item?.duration_ms ?? Number.MAX_SAFE_INTEGER) - progressMs;

                    if (timeLeft <= 10000 && isPlaying) {
                        timer(timeLeft + 1000).subscribe(() => this.forceRefresh$.next(new Date()));
                    }
                })
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public SetPlayState(playing: boolean): void {
        if (playing) {
            this.Spotify.play().subscribe(() => {
                this.IsPlaying = true;
            });
        } else {
            this.Spotify.pause().subscribe(() => {
                this.IsPlaying = false;
            });
        }
    }

    public SkipSong(): void {
        this.Spotify.skipSong().subscribe(() => {
            this.forceRefresh$.next(new Date());
        });
    }
}