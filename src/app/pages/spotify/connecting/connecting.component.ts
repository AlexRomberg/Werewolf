import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Subscription } from "rxjs";
import { SpotifyService } from "../../../services/spotify.service";
import { NgIconComponent } from "@ng-icons/core";

@Component({
    selector: "app-connecting",
    imports: [RouterLink, NgIconComponent],
    templateUrl: "./connecting.component.html"
})
export class ConnectingComponent implements OnInit, OnDestroy {
    private Spotify = inject(SpotifyService);
    private Route = inject(ActivatedRoute);
    private Router = inject(Router);

    private routeParamsSubscription: Subscription | undefined;

    ngOnInit(): void {
        this.routeParamsSubscription = this.Route.queryParamMap.subscribe(async (params) => {
            const code = params.get("code");
            if (code && await this.Spotify.UpdateAuthenticationState()) {
                this.Router.navigate(["/spotify/success"]);
            }
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription?.unsubscribe();
    }
}
