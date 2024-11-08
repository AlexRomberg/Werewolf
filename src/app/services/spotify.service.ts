/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, map, Observable, of, switchMap, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { StorageService as StorageService } from "./storage.service";

@Injectable({
    providedIn: "root"
})
export class SpotifyService {
    private clientId = environment.spotify.clientId;
    private redirectUri = environment.spotify.redirectUri;
    private authUrl = environment.spotify.authUrl;
    private tokenUrl = environment.spotify.tokenUrl;
    private apiBaseUrl = environment.spotify.apiBaseUrl;
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private expiry: Date = new Date(0);
    private codeVerifier = "";

    public get IsAuthenticated(): boolean {
        return Boolean(this.accessToken);
    }

    constructor(private http: HttpClient, private router: Router, private storage: StorageService) {
        this.loadTokens();
        window.addEventListener("storage", this.loadTokens.bind(this));
    }

    async GetAccountConnectionLink(): Promise<string> {
        this.codeVerifier = this.generateCodeVerifier();
        const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);
        this.storage.SpotifyCodeVerifier = this.codeVerifier;

        const scopes = [
            "user-read-playback-state",
            "user-modify-playback-state",
            "playlist-read-private"
        ].join(" ");

        const authParams = new HttpParams()
            .set("client_id", this.clientId)
            .set("response_type", "code")
            .set("redirect_uri", this.redirectUri)
            .set("scope", scopes)
            .set("code_challenge_method", "S256")
            .set("code_challenge", codeChallenge);

        return `${this.authUrl}?${authParams.toString()}`;
    }

    SaveCodeVerifyer(): void {
        // hack: since safari does not store localstorage unless user action is performed
        this.storage.SpotifyCodeVerifier = this.codeVerifier;
    }

    Logout(): void {
        this.accessToken = null;
        this.refreshToken = null;
        this.expiry = new Date(0);

        this.storage.ClearSpotifyData();
    }

    HandleAuthCode(code: string): void {
        const codeVerifier = this.storage.SpotifyCodeVerifier;
        if (!codeVerifier) {
            throw new Error("No code_verifier");
        }

        const body = new HttpParams()
            .set("grant_type", "authorization_code")
            .set("code", code)
            .set("redirect_uri", this.redirectUri)
            .set("client_id", this.clientId)
            .set("code_verifier", codeVerifier);

        this.http.post<{ access_token: string, refresh_token: string, expires_in: number }>(this.tokenUrl, body.toString(), {
            headers: new HttpHeaders({
                "Content-Type": "application/x-www-form-urlencoded"
            })
        }).subscribe(response => {
            this.accessToken = response.access_token;
            this.refreshToken = response.refresh_token;
            this.expiry = new Date(new Date().getTime() + (response.expires_in * 1000));

            this.storage.SpotifyAccessToken = this.accessToken;
            this.storage.SpotifyRefreshToken = this.refreshToken;
            this.storage.SpotifyExpiresIn = this.expiry;

            this.router.navigateByUrl("/spotify/success");
        });
    }

    public RefreshCurrentToken(): Observable<{ access_token: string; refresh_token: string; expires_in: number; }> {
        const body = new HttpParams()
            .set("client_id", this.clientId)
            .set("grant_type", "refresh_token")
            .set("refresh_token", this.refreshToken!);

        return this.http.post<{ access_token: string, refresh_token: string, expires_in: number }>(this.tokenUrl, body.toString(), {
            headers: new HttpHeaders({
                "Content-Type": "application/x-www-form-urlencoded"
            })
        }).pipe(tap(response => {
            this.accessToken = response.access_token;
            this.refreshToken = response.refresh_token;
            this.expiry = new Date(new Date().getTime() + (response.expires_in * 1000));

            this.storage.SpotifyAccessToken = this.accessToken;
            this.storage.SpotifyRefreshToken = this.refreshToken;
            this.storage.SpotifyExpiresIn = this.expiry;
        }));
    }

    private get Headers(): Observable<{ headers: HttpHeaders }> {
        if (this.expiry < new Date()) {
            return this.RefreshCurrentToken().pipe(catchError(e => {
                this.Logout();
                throw e;
            }), map(t => {
                return {
                    headers: new HttpHeaders({
                        Authorization: `Bearer ${t.access_token}`
                    })
                };
            }));
        }

        return of({
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.accessToken}`
            })
        });
    }

    GetPlayerState(): Observable<{ is_playing: boolean; progress_ms: number; item?: { duration_ms: number; name: string; artists: { name: string; }[]; }; device?: { is_private_session: boolean; }; }> {
        return this.Headers.pipe(switchMap(headers => {
            return this.http.get<{ is_playing: boolean, progress_ms: number, item?: { duration_ms: number, name: string, artists: { name: string }[] }, device?: { is_private_session: boolean } }>(`${this.apiBaseUrl}/me/player`, headers);
        }));
    }

    play(): Observable<string> {
        return this.Headers.pipe(switchMap(headers => {
            return this.http.put(`${this.apiBaseUrl}/me/player/play`, {}, { ...headers, responseType: "text" });
        }));
    }

    pause(): Observable<string> {
        return this.Headers.pipe(switchMap(headers => {
            return this.http.put(`${this.apiBaseUrl}/me/player/pause`, {}, { ...headers, responseType: "text" });
        }));
    }

    skipSong(): Observable<string> {
        return this.Headers.pipe(switchMap(headers => {
            return this.http.post(`${this.apiBaseUrl}/me/player/next`, {}, { ...headers, responseType: "text" });
        }));
    }

    playPlaylist(identifier: string, looped = false, randomStart = false): Observable<string> {
        return this.Headers.pipe(switchMap(headers => {
            return this.shuffleMode(randomStart, headers).pipe(switchMap(() => {
                return this.repeatMode(looped ? "context" : "off", headers).pipe(switchMap(() => {
                    return this.http.put<string>(`${this.apiBaseUrl}/me/player/play`, {
                        context_uri: `spotify:playlist:${identifier}`
                    }, headers);
                }));
            }));
        }));
    }

    PushSongToQueue(identifier: string): Observable<string> {
        return this.Headers.pipe(switchMap(headers => {
            return this.http.post<string>(`${this.apiBaseUrl}/me/player/queue`, {}, {
                ...headers,
                params: new HttpParams().set("uri", `spotify:track:${identifier}`)
            });
        }));
    }

    private repeatMode(state: "track" | "context" | "off", headers: {
        headers: HttpHeaders;
    }): Observable<string> {
        return this.http.put(`${this.apiBaseUrl}/me/player/repeat`, {}, {
            ...headers,
            responseType: "text",
            params: new HttpParams().set("state", state)
        }).pipe(catchError(e => {
            console.error("got exception", e);
            return "";
        }));
    }

    private shuffleMode(state: boolean, headers: {
        headers: HttpHeaders;
    }): Observable<string> {
        return this.http.put(`${this.apiBaseUrl}/me/player/shuffle`, {}, {
            ...headers,
            responseType: "text",
            params: new HttpParams().set("state", state)
        });
    }

    private generateCodeVerifier(): string {
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const randomValues = crypto.getRandomValues(new Uint8Array(64));
        return randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

    private async generateCodeChallenge(verifier: string): Promise<string> {
        if (!crypto.subtle) {
            throw new Error("No subtle crypto, are you in insecure context (http)?");
        }
        const data = new TextEncoder().encode(verifier);
        const hashed = await crypto.subtle.digest("SHA-256", data);

        return btoa(String.fromCharCode(...new Uint8Array(hashed)))
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    }

    private loadTokens(): void {
        this.accessToken = this.storage.SpotifyAccessToken;
        this.refreshToken = this.storage.SpotifyRefreshToken;
        this.expiry = this.storage.SpotifyExpiresIn;
    }
}