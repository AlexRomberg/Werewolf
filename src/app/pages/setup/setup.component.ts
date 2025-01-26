import { Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GameStateService } from "../../services/game-state.service";
import { Router, RouterLink } from "@angular/router";
import { CharacterGroup, GameSets, GroupTypes } from "../../types";
import { SpotifyService } from "../../services/spotify.service";
import { environment } from "../../../environments/environment";
import { GAME_SET_TRANSLATIONS, GROUP_TRANSLATIONS, NAME_TRANSLATIONS } from "../../i18n/translations";
import { LucideAngularModule } from "lucide-angular";
import { Device } from "@spotify/web-api-ts-sdk/dist/mjs/types";
import { I18nSelectPipe } from "@angular/common";
import { Character } from "../../models/characters/character";

@Component({
    selector: "app-setup",
    imports: [FormsModule, RouterLink, LucideAngularModule, I18nSelectPipe],
    templateUrl: "./setup.component.html",
    styleUrl: "./setup.component.css"
})
export class SetupComponent implements OnInit {
    private router = inject(Router);
    state = inject(GameStateService);
    spotify = inject(SpotifyService);

    isLoadingDevices = signal(false);
    isSelectingDevice = signal(false);
    isPeopleEditorOpen = signal(false);
    isCharacterEditorOpen = signal(false);
    grouping = signal<"group" | "game">("group");

    selectedCharacters: Character[] = [];
    NAME_TRANSLATIONS = NAME_TRANSLATIONS;

    ngOnInit(): void {
        if (this.state.People.length <= 0) {
            for (let i = 0; i < 8; i++) {
                this.state.addPerson();
            }
        }

        this.selectedCharacters = this.state.SelectedCharacters;
    }

    async updateDeviceList(): Promise<void> {
        this.isLoadingDevices.set(true);
        await this.spotify.UpdateDeviceList().then(() => {
            setTimeout(() => {
                this.isLoadingDevices.set(false);
            }, 1000);
        });
    }

    async setDevice(device: Device | undefined): Promise<void> {
        this.isSelectingDevice.set(true);
        await this.spotify.SetDevice(device).then(() => {
            this.isSelectingDevice.set(false);
        });
    }

    public async startBackgroundMusic(): Promise<void> {
        await this.spotify.PlayPlaylist(environment.spotify.playlists.start, false);
        this.spotify.BackgroundMusicStarted = true;
        await this.spotify.UpdatePlaybackState();
    }

    public getCharacterGroup(): CharacterGroup[] {
        if (this.grouping() === "group") {
            return Object.values(GroupTypes).filter(v => typeof v === "number").map(type => {
                return {
                    Name: GROUP_TRANSLATIONS[type],
                    Cards: this.state.AllCharacters.filter((c: Character) => c.Group === type)
                }
            });
        }
        return Object.values(GameSets).filter(v => typeof v === "number").map(gameSet => {
            return {
                Name: GAME_SET_TRANSLATIONS[gameSet],
                Cards: this.state.AllCharacters.filter((c: Character) => c.Game === gameSet)
            }
        });
    }

    toggleCharacterSelection(character: Character): void {
        if (this.selectedCharacters.includes(character)) {
            this.selectedCharacters = this.selectedCharacters.filter(c => c !== character);
        } else {
            this.selectedCharacters.push(character);
        }
    }

    async startGame() {
        this.state.SelectedCharacters = this.selectedCharacters;
        this.state.startGame();
        if (this.spotify.IsAuthenticated && this.spotify.CurrentDevice && !this.spotify.BackgroundMusicStarted) {
            await this.spotify.PlayPlaylist(environment.spotify.playlists.start, false);
            this.spotify.BackgroundMusicStarted = true;
        }
        this.router.navigateByUrl("/narrator");
    }
}
