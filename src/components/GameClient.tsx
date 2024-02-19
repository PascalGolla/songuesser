import { Info } from "@mui/icons-material";
import { Typography, CircularProgress, Alert, Input, Button } from "@mui/joy";
import JSConfetti from "js-confetti";
import { useState, useRef, useEffect } from "react";
import {
    SPOTIFY_CLIENT_ID,
    SPOTIFY_PLAYER_NAME,
    SPOTIFY_REDIRECT_URL,
    SPOTIFY_SCOPES,
} from "../config";
import { fuzzyGuess } from "../guess";
import { useSettings } from "../hooks/useSettings";
import { useSpotify } from "../hooks/useSpotify";
import InfoToast from "./InfoToast";
import Player from "./Player";

const NAME_THRESHOLD = 0.97;
const ARTIST_THRESHOLD = 0.97;
const ALBUM_THRESHOLD = 0.97;

export default function SpotifyWidget() {
    const [api, player] = useSpotify(
        SPOTIFY_PLAYER_NAME,
        SPOTIFY_CLIENT_ID,
        SPOTIFY_REDIRECT_URL,
        SPOTIFY_SCOPES
    );

    const [settings, setSettings] = useSettings();

    const [playbackState, setPlaybackState] =
        useState<Spotify.PlaybackState | null>(null);
    const [track, setTrack] = useState<Spotify.Track>();

    // User input for the track guess
    const [guess, setGuess] = useState("");

    // Score for the track guess
    const [score, setScore] = useState(0);

    // Flag if the guess was completed or not
    const [guessCompleted, setGuessCompleted] = useState(false);

    // State which holds the correct guesses of a track
    const [found, setFound] = useState({
        title: false,
        artist: false,
        album: false,
    });

    // State which holds, which part of the track shall be shown
    // in the ui
    const [show, setShow] = useState({
        title: false,
        artist: false,
        album: false,
    });

    // Flag to show toast
    const [nextSongToast, setNextSongToast] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    /**
     * Skip to the next song, by first alerting the user with
     * a toast and a 4s delay
     */
    const skipToNext = () => {
        setNextSongToast(true);

        setShow({ title: true, album: true, artist: true });

        setTimeout(() => {
            if (!api) return;
            api.player.skipToNext("").then(() => {
                // Hide the toast
                setNextSongToast(false);
            });
        }, 4000);
    };

    /**
     * Show confetti across the whole screen
     */
    const showConfetti = () => {
        const jsConfetti = new JSConfetti();
        jsConfetti
            .addConfetti({ confettiRadius: 3, confettiNumber: 40 })
            .then(() => {
                jsConfetti.clearCanvas();
            });
    };

    /**
     * When the track changes
     * - reset the found state
     * - reset the show state
     * - reset the guess score
     * - reset the guess input
     * - reset the guess complete state
     *
     * so the guessing can begin again
     */
    useEffect(() => {
        if (!track) return;
        setFound({ title: false, artist: false, album: false });
        setShow({ title: false, artist: false, album: false });
        setGuess("");
        setScore(0);
        setGuessCompleted(false);
    }, [track]);

    /**
     * When the found state changes, the user has successfully guessed
     * some part of the track.
     *
     * This effect:
     * - shows the guessed part of the track
     * - checks based on the settings, if the guess was completed
     *
     * If the guess completed:
     * 1. show confetti
     * 2. skip to the next song
     */
    useEffect(() => {
        // Do not trigger a completed guess when its already
        if (guessCompleted) return;

        // Show track details, if no already displayed.
        // Also delete the user input
        if (found.title && !show.title) {
            setShow({ ...found, title: true });
            setGuess("");
        }
        if (found.album && !show.album) {
            setShow({ ...found, album: true });
            setGuess("");
        }
        if (found.artist && !show.artist) {
            setShow({ ...found, artist: true });
            setGuess("");
        }

        // Check if the guess was completed or not
        // based on the settings
        if (settings.guessSuccess.name && !found.title) {
            setGuessCompleted(false);
            return;
        }

        if (settings.guessSuccess.album && !found.album) {
            setGuessCompleted(false);
            return;
        }

        if (settings.guessSuccess.artist && !found.artist) {
            setGuessCompleted(false);
            return;
        }

        // Guess was completed, show confetti and go to the next song
        setGuessCompleted(true);

        showConfetti();
        skipToNext();
    }, [found]);

    /**
     * When the Spotify api and player are initialized, setup listeners for:
     * - track changes
     * - device id of spotify player
     *
     * Then connect to the player, and switch the users spotify device to
     * this websites player.
     */
    useEffect(() => {
        if (!api || !player) return;

        player.addListener("player_state_changed", (e) => {
            if (e.track_window.current_track !== track) {
                setTrack(e.track_window.current_track);
            }
            (async () => {
                setPlaybackState(await player.getCurrentState());
            })();
        });

        player.addListener("ready", (e) => {
            api.player.transferPlayback([e.device_id]);
        });

        player.connect();
    }, [api, player]);

    /**
     * Based on the user inputted guess, check if guess
     * matches with the track
     */
    useEffect(() => {
        // if there is no track, no guess is possible
        if (!track) return;

        // no more guessing after a completed guess
        if (guessCompleted) return;

        if (guess === "") setScore(0);

        const titleGuess = fuzzyGuess(guess, track.name);
        const albumGuess = fuzzyGuess(guess, track.album.name);
        const artistGuess = fuzzyGuess(guess, track.artists[0].name);

        setScore(titleGuess);

        if (titleGuess >= NAME_THRESHOLD) {
            setFound((old) => {
                return { ...old, title: true };
            });
        }

        if (albumGuess >= ALBUM_THRESHOLD) {
            setFound((old) => {
                return { ...old, album: true };
            });
        }

        if (artistGuess >= ARTIST_THRESHOLD) {
            setFound((old) => {
                return { ...old, artist: true };
            });
        }
    }, [guess]);

    /**
     * Score effect for title
     */
    useEffect(() => {
        if (!ref.current) return;

        // When the guess is complete, do not animate anymore
        if (guessCompleted) {
            ref.current.style.boxShadow = `0px 0px ${
                (1 - 0.75) * 500
            }px rgba(255, 255, 255, 0.4)`;
            return;
        }

        if (score === 0) {
            ref.current.style.boxShadow = `0px 0px 0px rgba(255, 255, 255, 0.4)`;
            return;
        }

        ref.current.style.boxShadow = `0px 0px ${
            (score - 0.75) * 500
        }px rgba(255, 255, 255, 0.4)`;
    }, [score]);

    if (!playbackState) {
        return (
            <>
                <Typography
                    startDecorator={
                        <CircularProgress size="sm" variant="plain" />
                    }
                >
                    Loading spotify player...
                </Typography>
            </>
        );
    }

    if (!track) {
        return (
            <Alert startDecorator={<Info />} variant="soft" color="neutral">
                <Typography level="body-sm" color="neutral">
                    Switch to the device "{SPOTIFY_PLAYER_NAME}" on spotify and
                    play a song
                </Typography>
            </Alert>
        );
    }

    return (
        <>
            <Input
                variant="solid"
                color="neutral"
                onChange={(e) => {
                    setGuess(e.currentTarget.value);
                }}
                placeholder="Guess the song"
                value={guess}
                size="lg"
            />
            <br />
            <Player
                ref={ref}
                title={track.name}
                album={{
                    name: track.album.name,
                    cover: track.album.images[0].url,
                }}
                artists={track.artists.map((e) => e.name)}
                hideTitle={!show.title}
                hideAlbum={!show.album}
                hideArtists={!show.artist}
                isPlaying={!playbackState.paused}
                onChange={(e) => {
                    switch (e) {
                        case "pause":
                            player?.pause();
                            break;
                        case "play":
                            player?.resume();
                            break;
                    }
                }}
                volume={settings.playerVolume}
                onVolumeChange={(v) => {
                    setSettings({
                        ...settings,
                        playerVolume: v,
                    });
                    player?.setVolume(v);
                }}
            />
            <br />
            <Button
                variant="solid"
                color="neutral"
                onClick={() => skipToNext()}
            >
                🤷‍♂️🤷‍♀️
            </Button>
            {nextSongToast ? (
                <>
                    <InfoToast open text="Next song..." duration={4000} />
                </>
            ) : (
                <></>
            )}
        </>
    );
}
