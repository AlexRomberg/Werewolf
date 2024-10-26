import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { NgIconComponent } from "@ng-icons/core";
import { BehaviorSubject, interval, merge, Subscription, switchMap, tap, timer } from "rxjs";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: "app-spotify-widget",
    standalone: true,
    imports: [NgIconComponent, AsyncPipe],
    templateUrl: "./spotify-widget.component.html",
    styleUrl: "./spotify-widget.component.css"
})
export class SpotifyWidgetComponent implements OnInit, OnDestroy {
    title = "Nichts am abspielen";
    isPlaying = false;
    @Input() mode: "setup" | "narrator" = "setup";
    private forceRefresh$ = new BehaviorSubject<Date>(new Date());
    private subscription: Subscription = new Subscription();

    constructor(public spotify: SpotifyService) { }

    ngOnInit(): void {
        const tenSecondsInterval$ = interval(10000);
        const refresh$ = merge(tenSecondsInterval$, this.forceRefresh$);

        this.subscription = refresh$
            .pipe(
                switchMap(() => this.spotify.getPlayerState()),
                tap(({ item, is_playing, progress_ms }) => {
                    this.title = item.name + " - " + item.artists.map(a => a.name).join(", ");
                    this.isPlaying = is_playing;
                    const timeLeft = item.duration_ms - progress_ms;

                    if (timeLeft <= 10000 && is_playing) {
                        timer(timeLeft + 1000).subscribe(() => this.forceRefresh$.next(new Date()));
                    }
                })
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public setPlayState(playing: boolean) {
        if (playing) {
            this.spotify.play().subscribe(() => {
                this.isPlaying = true;
            });
        } else {
            this.spotify.pause().subscribe(() => {
                this.isPlaying = false;
            });
        }
    }

    public skipSong() {
        this.spotify.skipSong().subscribe(() => {
            this.forceRefresh$.next(new Date());
        });
    }
}