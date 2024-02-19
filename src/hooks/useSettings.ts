import { useEffect, useState } from "react";

interface GuessSuccess {
    name: boolean;
    artist: boolean;
    album: boolean;
}

interface GameSettings {
    playerVolume: number;

    guessSuccess: GuessSuccess;
}

export function useSettings(): [
    GameSettings,
    React.Dispatch<React.SetStateAction<GameSettings>>
] {
    const localStorageKey = "settings";

    const [settings, setSettings] = useState<GameSettings>({
        playerVolume: 0.5,
        guessSuccess: {
            name: true,
            artist: false,
            album: false,
        },
    });

    /**
     * During the init, check for settings saved in the local storage.
     *
     * Overwrite the default settings with the local storage once, if
     * available
     */
    useEffect(() => {
        // Check the local storage for already saved settings
        const savedSettings = localStorage.getItem(localStorageKey);
        if (!savedSettings) return;

        // There are saved settings, load them into the settings state
        const jsonSavedSettings = JSON.parse(savedSettings);
        if (!jsonSavedSettings) return;
        setSettings(jsonSavedSettings as GameSettings);
    }, []);

    /**
     * Check for changes of the settings state.
     *
     * If there are any, save them directly to the local storage
     */
    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(settings));
    }, [settings]);

    return [settings, setSettings];
}
