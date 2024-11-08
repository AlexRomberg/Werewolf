import { Injectable, isDevMode } from "@angular/core";
import { CharacterGroup } from "../types";
import { GroupedRoles } from "../models/roles/roles";

@Injectable({
    providedIn: "root"
})
export class StorageService {
    // Spotify
    public get SpotifyCodeVerifier(): string | null {
        const token = localStorage.getItem("spotify_code_verifier");
        localStorage.removeItem("spotify_code_verifier");
        return token;
    }
    public set SpotifyCodeVerifier(value: string) {
        localStorage.setItem("spotify_code_verifier", value);
    }

    public get SpotifyAccessToken(): string | null {
        return localStorage.getItem("spotify_access_token");
    }
    public set SpotifyAccessToken(value: string) {
        localStorage.setItem("spotify_access_token", value);
    }

    public get SpotifyRefreshToken(): string | null {
        return localStorage.getItem("spotify_refresh_token");
    }
    public set SpotifyRefreshToken(value: string) {
        localStorage.setItem("spotify_refresh_token", value);
    }

    public get SpotifyExpiresIn(): Date {
        const dateString = localStorage.getItem("spotify_expires_in");
        return dateString ? new Date(dateString) : new Date(0);
    }
    public set SpotifyExpiresIn(value: Date) {
        localStorage.setItem("spotify_expires_in", value.toString());
    }

    public ClearSpotifyData(): void {
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_code_verifier");
        localStorage.removeItem("spotify_expires_in");
        localStorage.removeItem("spotify_refresh_token");
    }

    // Setup
    public get SetupSelection(): CharacterGroup[] {
        const selection: boolean[][] = JSON.parse(localStorage.getItem("setup_selected_cards") ?? "[]");
        const selectionGroups = GroupedRoles;
        for (let group = 0; group < selectionGroups.length; group++) {
            for (let selectionIdx = 0; selectionIdx < selectionGroups[group].Cards.length; selectionIdx++) {
                if (selection?.[group]?.[selectionIdx]) {
                    selectionGroups[group].Cards[selectionIdx].Selected = selection[group][selectionIdx];
                }
            }
        }
        return selectionGroups;
    }
    public set SetupSelection(selectionGroups: CharacterGroup[]) {
        const slection = selectionGroups.map(v => v.Cards.map(c => c.Selected));
        localStorage.setItem("setup_selected_cards", JSON.stringify(slection));
    }

    public get SetupPeopleCount(): number {
        return Number(localStorage.getItem("setup_people_count") ?? (isDevMode() ? 20 : 1));
    }
    public set SetupPeopleCount(selectionGroups: number) {
        localStorage.setItem("setup_people_count", selectionGroups.toString());
    }
}
