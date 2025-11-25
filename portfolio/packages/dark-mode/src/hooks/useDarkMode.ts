import { useEffect } from "react";
import { useStore } from "@tanstack/react-store";
import { darkStore } from "../lib/store/darkStore";

const STORAGE_KEY = "user-theme";

export const useDarkMode = () => {
    const choseDark = useStore(darkStore);

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const stored = localStorage.getItem(STORAGE_KEY);

        let initialDark: boolean;

        if (stored === null) {

            // no user preference → follow system
            initialDark = media.matches;
        } else {
            // user has toggled before
            initialDark = stored === "dark";
        }

        darkStore.setState(initialDark);
        document.body.setAttribute("data-light-selected", String(!initialDark));
        document.documentElement.classList.toggle("dark", initialDark);
        document.body.classList.add("group");

        // watch system preference changes if user hasn't chosen manually
        const listener = (e: MediaQueryListEvent) => {
            const userSet = localStorage.getItem(STORAGE_KEY);
            if (userSet === null) {
                const prefersDark = e.matches;
                darkStore.setState(prefersDark);
                document.body.setAttribute("data-light-selected", String(!prefersDark));
                document.documentElement.classList.toggle("dark", prefersDark);
            }
        };

        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, []);

    const toggleDarkMode = () => {
        darkStore.setState((val) => {
            const newVal = !val;
            document.body.setAttribute("data-light-selected", String(!newVal));
            document.documentElement.classList.toggle("dark", newVal);
            localStorage.setItem(STORAGE_KEY, newVal ? "dark" : "light");
            return newVal;
        });
    };

    return { choseDark, toggleDarkMode };
};