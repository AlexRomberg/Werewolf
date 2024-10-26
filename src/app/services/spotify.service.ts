import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { environment } from "../../environments/environment";

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

    public get IsAuthenticated() {
        return Boolean(this.accessToken);
    }

    constructor(private http: HttpClient, private router: Router) {
        this.loadTokens();
        window.addEventListener("storage", this.loadTokens.bind(this));
    }

    async getAccountConnectionLink() {
        this.codeVerifier = this.generateCodeVerifier();
        const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);
        localStorage.setItem("spotify_code_verifier", this.codeVerifier);

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

    saveCodeVerifyer() {
        // hack since safari does not sore localstorrage unless useraction is performed
        localStorage.setItem("spotify_code_verifier", this.codeVerifier);
    }

    logout() {
        this.accessToken = null;
        this.refreshToken = null;
        this.expiry = new Date(0);

        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_code_verifier");
        localStorage.removeItem("spotify_expires_in");
        localStorage.removeItem("spotify_refresh_token");
    }

    handleAuthCode(code: string) {
        const codeVerifier = localStorage.getItem("spotify_code_verifier")!;
        if (codeVerifier) {
            localStorage.removeItem("spotify_code_verifier");
        } else {
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

            localStorage.setItem("spotify_access_token", this.accessToken);
            localStorage.setItem("spotify_refresh_token", this.refreshToken);
            localStorage.setItem("spotify_expires_in", this.expiry.toString());

            this.router.navigateByUrl("/spotify/success");
        });
    }

    public refreshCurrentToken() {
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

            localStorage.setItem("spotify_access_token", this.accessToken);
            localStorage.setItem("spotify_refresh_token", this.refreshToken);
            localStorage.setItem("spotify_expires_in", this.expiry.toString());
        }));
    }

    private get headers() {
        if (this.expiry < new Date()) {
            return this.refreshCurrentToken().pipe(catchError(e => {
                this.logout();
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

    getPlayerState() {
        return this.headers.pipe(switchMap(headers => {
            return this.http.get<{ is_playing: boolean, progress_ms: number, item: { duration_ms: number, name: string, artists: { name: string }[] } }>(`${this.apiBaseUrl}/me/player`, headers);
        }));
    }

    play() {
        return this.headers.pipe(switchMap(headers => {
            return this.http.put(`${this.apiBaseUrl}/me/player/play`, {}, { ...headers, responseType: "text" });
        }));
    }

    pause() {
        return this.headers.pipe(switchMap(headers => {
            return this.http.put(`${this.apiBaseUrl}/me/player/pause`, {}, { ...headers, responseType: "text" });
        }));
    }

    skipSong() {
        return this.headers.pipe(switchMap(headers => {
            return this.http.post(`${this.apiBaseUrl}/me/player/next`, {}, { ...headers, responseType: "text" });
        }));
    }

    playPlaylist(identifier: string, looped = false, randomStart = false) {
        return this.headers.pipe(switchMap(headers => {
            return this.shuffleMode(randomStart, headers).pipe(switchMap(() => {
                return this.http.put(`${this.apiBaseUrl}/me/player/play`, {
                    context_uri: `spotify:playlist:${identifier}`
                }, headers).pipe(tap(
                    looped ? this.repeatMode("context", headers).subscribe() : this.repeatMode("off", headers).subscribe()
                ));
            }));
        }));
    }

    pushSongToQueue(identifier: string) {
        return this.headers.pipe(switchMap(headers => {
            return this.http.post(`${this.apiBaseUrl}/me/player/queue`, {}, {
                ...headers,
                params: new HttpParams().set("uri", `spotify:track:${identifier}`)
            });
        }));
    }

    private repeatMode(state: "track" | "context" | "off", headers: {
        headers: HttpHeaders;
    }) {
        return this.http.put(`${this.apiBaseUrl}/me/player/repeat`, {}, {
            ...headers,
            responseType: "text",
            params: new HttpParams().set("state", state)
        });
    }

    private shuffleMode(state: boolean, headers: {
        headers: HttpHeaders;
    }) {
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

    private loadTokens() {
        this.accessToken = localStorage.getItem("spotify_access_token");
        this.refreshToken = localStorage.getItem("spotify_refresh_token");
        const expiry = localStorage.getItem("spotify_expires_in");
        this.expiry = expiry ? new Date(expiry) : new Date(0);
    }
}