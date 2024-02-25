import { Forward10, Pause, PlayArrow, Replay10 } from "@mui/icons-material";
import {
    AspectRatio,
    Card,
    IconButton,
    Skeleton,
    Slider,
    Stack,
    Typography,
} from "@mui/joy";
import ColorThief, { Color } from "colorthief";
import {
    SyntheticEvent,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

interface Album {
    name: string;
    cover: string;
}

type Event = "pause" | "play" | "forward10s" | "replay10s";

interface PlayerParams {
    title: string;
    album: Album;
    artists: string[];

    isPlaying: boolean;
    volume: number;

    onChange(event: Event): void;

    onVolumeChange(volume: number): void;

    hideTitle: boolean;
    hideAlbum: boolean;
    hideArtists: boolean;
}

interface AlbumCoverParams {
    imageUrl: string;
    hide: boolean;

    onAlbumColors(mainColor: Color, palette: Color[]): void;
}

function AlbumCover(params: AlbumCoverParams) {
    function getColor(event: SyntheticEvent<HTMLImageElement>) {
        (async () => {
            const colorThief = new ColorThief();
            const mainColor = await colorThief.getColor(
                event.target as HTMLImageElement
            );
            const palette = await colorThief.getPalette(
                event.target as HTMLImageElement
            );

            params.onAlbumColors(mainColor, palette);
        })();
    }

    return (
        <Card
            variant="outlined"
            sx={{
                p: 0,
                border: "none",
                boxShadow: "0px 10px 10px rgba(0,0,0,0.3)",
            }}
        >
            <AspectRatio ratio="1/1">
                <img
                    style={{
                        filter: params.hide ? "blur(20px)" : "blur(0px)",
                    }}
                    src={params.imageUrl}
                    onLoad={getColor}
                    crossOrigin="anonymous"
                />
            </AspectRatio>
        </Card>
    );
}

export default forwardRef<HTMLElement | null, PlayerParams>(function Player(
    params,
    ref
) {
    const internalRef = useRef<HTMLDivElement>(null);

    const [volume, setVolume] = useState(params.volume);

    useEffect(() => {
        params.onVolumeChange(volume);
    }, [volume]);

    useImperativeHandle(ref, () => {
        return internalRef.current as HTMLElement;
    });

    const onColorChange = (mainColor: Color, palette: Color[]) => {
        if (!internalRef.current) return;

        const color = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.8)`;
        const color1 = `rgba(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]}, 0.8)`;
        const color2 = `rgba(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]}, 1)`;
        const color3 = `rgba(${palette[2][0]}, ${palette[2][1]}, ${palette[2][2]}, 1)`;

        internalRef.current.style.backgroundImage = `repeating-linear-gradient(-45deg, ${color1} 0%, ${color2} 25%, ${color} 50%, ${color3} 100%)`;
    };

    return (
        <>
            <Card
                ref={internalRef}
                variant="soft"
                sx={{
                    backgroundColor: "#FBFCFE10",
                    maxWidth: 400,
                    p: 3,
                    transition: "0.4s ease",
                    mb: 2,
                }}
                className="gradient-animation"
            >
                <AlbumCover
                    imageUrl={params.album.cover}
                    hide={params.hideAlbum}
                    onAlbumColors={onColorChange}
                />
                <Card
                    variant="soft"
                    sx={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                >
                    <Typography sx={{ color: "white" }} level="h1">
                        <Skeleton animation="wave" loading={params.hideTitle}>
                            {params.title}
                        </Skeleton>
                    </Typography>
                    <Typography sx={{ color: "white" }} level="body-md">
                        <Skeleton animation="wave" loading={params.hideArtists}>
                            {params.artists.join(", ")}
                        </Skeleton>
                    </Typography>
                    <Typography sx={{ color: "white" }} level="body-md">
                        <Skeleton animation="wave" loading={params.hideAlbum}>
                            {params.album.name}
                        </Skeleton>
                    </Typography>
                </Card>
            </Card>
            <Card variant="soft">
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <IconButton disabled size="sm" variant="plain">
                        <Replay10 />
                    </IconButton>
                    <IconButton
                        size="lg"
                        variant="solid"
                        sx={{ boxShadow: "0px 2px 5px rgba(0,0,0,0.3)" }}
                        onClick={() =>
                            params.isPlaying
                                ? params.onChange("pause")
                                : params.onChange("play")
                        }
                    >
                        {params.isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    <IconButton disabled size="sm" variant="plain">
                        <Forward10 />
                    </IconButton>
                </Stack>
            </Card>

            <Stack sx={{ width: "50%", marginLeft: "25%" }}>
                <Slider
                    value={volume}
                    min={0}
                    step={0.05}
                    max={1}
                    size="sm"
                    color="neutral"
                    onChange={(_, v) => setVolume(v as number)}
                />
            </Stack>
        </>
    );
});
