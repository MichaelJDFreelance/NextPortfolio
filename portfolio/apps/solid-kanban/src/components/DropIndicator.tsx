// DropIndicator.tsx
import { JSX } from "solid-js";

interface DropIndicatorProps {
    edge: "left" | "right" | "top" | "bottom";
    gap?: string; // e.g. "8px"
}

export function DropIndicator(props: DropIndicatorProps): JSX.Element {
    const thickness = "4px"; // Tune this to mimic Atlaskit
    const gap = props.gap ?? "8px";

    const styles: Record<string, JSX.CSSProperties> = {
        left: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `calc(-1 * ${gap})`,
            width: thickness,
            background: "var(--accent-foreground)", // or a custom color
            "border-radius": "2px",
        },
        right: {
            position: "absolute",
            top: 0,
            bottom: 0,
            right: `calc(-1 * ${gap})`,
            width: thickness,
            background: "var(--accent-foreground)",
            "border-radius": "2px",
        },
        top: {
            position: "absolute",
            top: `calc(-1 * ${gap})`,
            left: 0,
            right: 0,
            height: thickness,
            background: "var(--accent-foreground)",
            "border-radius": "2px",
        },
        bottom: {
            position: "absolute",
            bottom: `calc(-1 * ${gap})`,
            left: 0,
            right: 0,
            height: thickness,
            background: "var(--accent-foreground)",
            "border-radius": "2px",
        },
    };

    return <div style={styles[props.edge]} />;
}