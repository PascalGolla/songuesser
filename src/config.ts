import { Scopes } from "@spotify/web-api-ts-sdk";

export const SPOTIFY_PLAYER_NAME = "🎶Songuesser";
export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
export const SPOTIFY_REDIRECT_URL = import.meta.env.VITE_SPOTIFY_REDIRECT_URL;
export const SPOTIFY_SCOPES = Scopes.userPlaybackModify;
