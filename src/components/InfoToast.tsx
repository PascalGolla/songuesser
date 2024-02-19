import { CircularProgress, Snackbar } from "@mui/joy";
import { useEffect, useRef, useState } from "react";

interface InfoToastParams {
    open: boolean;
    text: string;
    duration: number;
    onClose?(): void;
}

export default function InfoToast(params: InfoToastParams) {
    const [open, setOpen] = useState(() => params.open);
    const [left, setLeft] = useState<undefined | number>();
    const timer = useRef<undefined | number>();
    const [progress, setProgress] = useState(0);

    const countdown = () => {
        timer.current = window.setInterval(() => {
            setLeft((prev) =>
                prev === undefined ? prev : Math.max(0, prev - 100)
            );
        }, 100);
    };
    useEffect(() => {
        if (open && params.duration !== undefined && params.duration > 0) {
            setLeft(params.duration);
            countdown();
        } else {
            window.clearInterval(timer.current);
        }
    }, [open, params.duration]);

    useEffect(() => {
        if (!left) {
            setProgress(100);
            return;
        }

        setProgress((1 - left / params.duration + 0.05) * 100);
    }, [left]);

    return (
        <Snackbar
            open={open}
            variant="soft"
            color="neutral"
            autoHideDuration={params.duration}
            size="sm"
            onClose={() => {
                setOpen(false);
                if (params.onClose) params.onClose();
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <CircularProgress size="sm" determinate value={progress} />
            {params.text}
        </Snackbar>
    );
}
