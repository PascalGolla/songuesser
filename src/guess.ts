import { fuzzyString } from "./fuzzy";
import { transliterate as tr } from "transliteration";

export interface Track {
    name: string;
    artist: string;
    album: string;
}

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

export function fuzzyGuess(guess: string, str: string): number {
    guess = reduceNameComplexity(guess);

    str = reduceNameComplexity(str);

    const fuzzyResult = fuzzyString(guess, str);

    return fuzzyResult.score;
}
