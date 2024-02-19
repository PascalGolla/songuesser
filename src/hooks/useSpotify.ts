import { useEffect, useRef, useState } from "react";
import {
    SpotifyApi,
    SdkOptions,
    AuthorizationCodeWithPKCEStrategy,
} from "@spotify/web-api-ts-sdk";

export function useSpotify(
    name: string,
    clientId: string,
    redirectUrl: string,
    scopes: string[],
    config?: SdkOptions
): [SpotifyApi | null, Spotify.Player | null] {
    const [api, setApi] = useState<SpotifyApi | null>(null);
    const [player, setPlayer] = useState<Spotify.Player | null>(null);

    const { current: activeScopes } = useRef(scopes);

    useEffect(() => {
        if (api) return;
        (async () => {
            const auth = new AuthorizationCodeWithPKCEStrategy(
                clientId,
                redirectUrl,
                activeScopes
            );
            const internalSdk = new SpotifyApi(auth, config);

            try {
                const { authenticated } = await internalSdk.authenticate();

                if (authenticated) {
                    setApi(() => internalSdk);
                }
            } catch (e: Error | unknown) {
                const error = e as Error;
                if (
                    error &&
                    error.message &&
                    error.message.includes("No verifier found in cache")
                ) {
                    console.error(
                        "If you are seeing this error in a React Development Environment it's because React calls useEffect twice. Using the Spotify SDK performs a token exchange that is only valid once, so React re-rendering this component will result in a second, failed authentication. This will not impact your production applications (or anything running outside of Strict Mode - which is designed for debugging components).",
                        error
                    );
                } else {
                    console.error(e);
                }
            }
        })();
    }, [clientId, redirectUrl, config, activeScopes]);

    useEffect(() => {
        (async () => {
            if (player) return;
            if (!api) return;
            const token = await api.getAccessToken();
            if (!token) return;

            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;

            document.body.appendChild(script);
            window.onSpotifyWebPlaybackSDKReady = () => {
                const player = new window.Spotify.Player({
                    name: name,
                    getOAuthToken: (cb) => {
                        cb(token.access_token);
                    },
                    volume: 0.5,
                });

                setPlayer(player);
            };
        })();
    }, [api, name]);

    return [api, player];
}
