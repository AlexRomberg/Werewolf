import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { SpotifyService } from "../../../services/spotify.service";

@Component({
    selector: "app-connecting",
    imports: [],
    templateUrl: "./connecting.component.html"
})
export class ConnectingComponent implements OnInit, OnDestroy {
    private routeParamsSubscription: Subscription | undefined;

    constructor(public Spotify: SpotifyService, private Route: ActivatedRoute) { }

    ngOnInit(): void {
        this.routeParamsSubscription = this.Route.queryParamMap.subscribe(params => {
            const code = params.get("code");
            if (code) {
                this.Spotify.HandleAuthCode(code);
            }
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription?.unsubscribe();
    }
}
