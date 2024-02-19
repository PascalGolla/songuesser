import { fuzzyString } from "./fuzzy";
import { transliterate as tr } from "transliteration";

export interface Track {
    name: string;
    artist: string;
    album: string;
}

export type GuessType = "none" | "name" | "artist" | "album";

export interface GuessResult {
    found: boolean;
    type: GuessType;
    score: number;
}

const NAME_THRESHOLD = 0.97;
const ARTIST_THRESHOLD = 0.97;
const ALBUM_THRESHOLD = 0.97;

const reduceNameComplexity = (name: string) => {
    // first transliterate the name
    name = tr(name, { trim: true });

    name = name.toLowerCase();
    name = name.split("(")[0].trimEnd();
    name = name.split("[")[0].trimEnd();
    name = name.split(": ")[0].trimEnd();
    name = name.split(" - ")[0];
    name = name.replace("'", "");
    name = name.replace(",", "");
    name = name.replace(";", "");
    name = name.replace(":", "");
    name = name.replace(".", "");
    name = name.replace("!", "");
    name = name.replace("?", "");
    name = name.replace("/", "");
    name = name.replace("-", "");
    name = name.replace("_", "");

    return name;
};

export function guessTrack(str: string, track: Track): GuessResult {
    str = reduceNameComplexity(str);

    track.name = reduceNameComplexity(track.name);
    track.artist = reduceNameComplexity(track.artist);
    track.album = reduceNameComplexity(track.album);

    const nameResult = fuzzyString(str, track.name);
    const artistResult = fuzzyString(str, track.artist);
    const albumResult = fuzzyString(str, track.album);

    let result: GuessResult = {
        found: false,
        type: "none",
        score: nameResult.score,
    };

    if (nameResult.score >= NAME_THRESHOLD) {
        result.found = true;
        result.type = "name";
        return result;
    }

    if (artistResult.score >= ARTIST_THRESHOLD) {
        result.found = true;
        result.type = "artist";
        return result;
    }

    if (albumResult.score >= ALBUM_THRESHOLD) {
        result.found = true;
        result.type = "album";
        return result;
    }

    return result;
}
