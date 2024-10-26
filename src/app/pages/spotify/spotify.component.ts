import { Component, OnDestroy, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
    selector: "app-spotify",
    standalone: true,
    imports: [],
    templateUrl: "./spotify.component.html"
})
export class SpotifyComponent implements OnInit, OnDestroy {
    private routeParamsSubscription: Subscription | undefined;

    constructor(public spotify: SpotifyService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.routeParamsSubscription = this.route.queryParamMap.subscribe(params => {
            const code = params.get("code");
            if (code) {
                this.spotify.handleAuthCode(code);
            }
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription?.unsubscribe();
    }
}
