import Drawer from "@mui/joy/Drawer";
import Checkbox from "@mui/joy/Checkbox";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import ModalClose from "@mui/joy/ModalClose";
import Divider from "@mui/joy/Divider";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import TuneIcon from "@mui/icons-material/TuneRounded";

import Done from "@mui/icons-material/Done";
import { IconButton } from "@mui/joy";
import { useState } from "react";
import { GuessSuccess } from "../hooks/useSettings";

interface SettingsDrawerParams {
    settings: GuessSuccess;
    onChange(settings: GuessSuccess): void;
}

export default function SettingsDrawer(params: SettingsDrawerParams) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton
                size="md"
                variant="soft"
                color="neutral"
                onClick={() => setOpen(true)}
            >
                <TuneIcon />
            </IconButton>
            <Drawer
                size="md"
                variant="plain"
                open={open}
                anchor="top"
                onClose={() => setOpen(false)}
                slotProps={{
                    content: {
                        sx: {
                            bgcolor: "transparent",
                            p: { md: 3, sm: 0 },
                            maxHeight: "40%",
                            boxShadow: "none",
                        },
                    },
                }}
            >
                <Sheet
                    sx={{
                        borderRadius: "md",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        height: "100%",
                        overflow: "auto",
                    }}
                >
                    <DialogTitle>Settings</DialogTitle>
                    <ModalClose />
                    <Divider sx={{ mt: "auto" }} />
                    <DialogContent sx={{ gap: 2 }}>
                        <Typography
                            level="title-md"
                            fontWeight="bold"
                            sx={{ mt: 1 }}
                        >
                            Guess option
                        </Typography>
                        <Typography level="body-sm">
                            Define which part of a song needs to be guessed in
                            order to complete the song guess.
                        </Typography>
                        <div role="group" aria-labelledby="rank">
                            <List
                                orientation="horizontal"
                                wrap
                                sx={{
                                    "--List-gap": "8px",
                                    "--ListItem-radius": "20px",
                                    "--ListItem-minHeight": "32px",
                                    "--ListItem-gap": "4px",
                                }}
                            >
                                <ListItem>
                                    {params.settings.name ? <Done /> : <></>}
                                    <Checkbox
                                        size="sm"
                                        color={
                                            params.settings.name
                                                ? "primary"
                                                : "neutral"
                                        }
                                        disableIcon
                                        overlay
                                        label="Title"
                                        variant="outlined"
                                        checked={params.settings.name}
                                        onChange={(e) => {
                                            params.onChange({
                                                ...params.settings,
                                                name: e.target.checked,
                                            });
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    {params.settings.album ? <Done /> : <></>}
                                    <Checkbox
                                        size="sm"
                                        color={
                                            params.settings.album
                                                ? "primary"
                                                : "neutral"
                                        }
                                        disableIcon
                                        overlay
                                        label="Album"
                                        variant="outlined"
                                        checked={params.settings.album}
                                        onChange={(e) => {
                                            params.onChange({
                                                ...params.settings,
                                                album: e.target.checked,
                                            });
                                        }}
                                    />
                                </ListItem>

                                <ListItem>
                                    {params.settings.artist ? <Done /> : <></>}
                                    <Checkbox
                                        size="sm"
                                        color={
                                            params.settings.artist
                                                ? "primary"
                                                : "neutral"
                                        }
                                        disableIcon
                                        overlay
                                        label="Artist"
                                        variant="outlined"
                                        checked={params.settings.artist}
                                        onChange={(e) => {
                                            params.onChange({
                                                ...params.settings,
                                                artist: e.target.checked,
                                            });
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </div>
                    </DialogContent>
                </Sheet>
            </Drawer>
        </>
    );
}
