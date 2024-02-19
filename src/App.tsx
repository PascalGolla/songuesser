import { useState } from "react";
import "./App.css";
import { Button, CssVarsProvider, Typography } from "@mui/joy";

import { SPOTIFY_PLAYER_NAME } from "./config";

import GameClient from "./components/GameClient";

export default function App() {
    const [startGame, setStartGame] = useState(false);

    return (
        <CssVarsProvider defaultMode="dark">
            <Typography sx={{ color: "#FFFFFF60", mb: 2 }} level="h1">
                {SPOTIFY_PLAYER_NAME}
            </Typography>
            {startGame ? (
                <GameClient />
            ) : (
                <Button
                    color="success"
                    onClick={() => {
                        setStartGame(true);
                    }}
                    startDecorator={
                        <img
                            style={{ filter: "brightness(0) invert(1)" }}
                            src="/spotify.png"
                            width={24}
                        />
                    }
                >
                    Start guessing
                </Button>
            )}
        </CssVarsProvider>
    );
}
