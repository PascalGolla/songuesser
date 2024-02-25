import { useState } from "react";
import "./App.css";
import { Box, Button, CssVarsProvider, Typography } from "@mui/joy";

import { BASE_URL, SPOTIFY_PLAYER_NAME } from "./config";

import GameClient from "./components/GameClient";

export default function App() {
    const [startGame, setStartGame] = useState(false);

    return (
        <CssVarsProvider defaultMode="dark">
            <Box>
                {startGame ? (
                    <GameClient />
                ) : (
                    <>
                        <Typography
                            sx={{ color: "#FFFFFF60", mb: 2 }}
                            level="body-lg"
                        >
                            {SPOTIFY_PLAYER_NAME}
                        </Typography>
                        <Button
                            color="success"
                            onClick={() => {
                                setStartGame(true);
                            }}
                            startDecorator={
                                <img
                                    style={{
                                        filter: "brightness(0) invert(1)",
                                    }}
                                    src={`${BASE_URL}/spotify.png`}
                                    width={24}
                                />
                            }
                        >
                            connect via Spotify
                        </Button>
                    </>
                )}
            </Box>
        </CssVarsProvider>
    );
}
