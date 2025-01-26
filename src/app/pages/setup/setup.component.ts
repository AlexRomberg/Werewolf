import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GameStateService } from "../../services/game-state.service";
import { Router, RouterLink } from "@angular/router";
import { CardComponent } from "../../components/setup/card/card.component";
import { CardSelectionInformation, CharacterGroup } from "../../types";
import { SpotifyWidgetComponent } from "../../components/spotify-widget/spotify-widget.component";
import { SpotifyService } from "../../services/spotify.service";
import { environment } from "../../../environments/environment";
import { StorageService } from "../../services/storage.service";
import { I18nSelectPipe } from "@angular/common";
import { NAME_TRANSLATIONS } from "../../i18n/translations";
import { LucideAngularModule } from "lucide-angular";

@Component({
    selector: "app-setup",
    imports: [FormsModule, CardComponent, SpotifyWidgetComponent, RouterLink, I18nSelectPipe, LucideAngularModule],
    templateUrl: "./setup.component.html",
    styleUrl: "./setup.component.css"
})
export class SetupComponent {
    private state = inject(GameStateService);
    private router = inject(Router);
    private spotify = inject(SpotifyService);
    private storage = inject(StorageService);

    NAME_TRANSLATIONS = NAME_TRANSLATIONS;
    public Roles: CharacterGroup[] = this.storage.SetupSelection;
    public PeopleCount: number = this.storage.SetupPeopleCount;

    public async StartGame(): Promise<void> {
        this.state.SelectedCharacters = this.Roles
            .map(r => r.Cards)
            .flat()
            .filter(r => r.Selected)
            .sort((ra, rb) => (ra.Character.Priority ?? -1) - (rb.Character.Priority ?? -1))
            .map(r => r.Character);
        this.state.startGame();
        if (this.spotify.IsAuthenticated && this.spotify.CurrentDevice && !this.spotify.BackgroundMusicStarted) {
            await this.spotify.PlayPlaylist(environment.spotify.playlists.start, false);
            this.spotify.BackgroundMusicStarted = true;
        }
        this.router.navigateByUrl("/narrator");
    }

    public HandleSelectionStateChange(card: CardSelectionInformation, selected: boolean): void {
        card.Selected = selected;
        this.storage.SetupSelection = this.Roles;
    }

    public HandlePeopleCountChanged(people: number): void {
        this.PeopleCount = people;
        this.storage.SetupPeopleCount = people;
    }

    public GetSelectedCards(): CardSelectionInformation[] {
        return this.Roles
            .map(r => r.Cards)
            .flat()
            .filter(r => r.Selected);
    }
}
