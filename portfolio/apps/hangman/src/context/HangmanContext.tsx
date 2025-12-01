"use client";

import {createContext, ReactNode, useContext, useEffect} from "react";
import { useStore } from "@tanstack/react-store";
import { hangmanStore, startGame, guessLetter } from "@/lib/store/hangmanStore";
import { useRouter } from "next/navigation";

const HangmanContext = createContext<ReturnType<typeof useHangmanValue> | null>(null);

function useHangmanValue() {
    const router = useRouter();
    const snapshot = useStore(hangmanStore);

    // Optional: react to state changes
    useEffect(() => {
        switch (snapshot.value) {
            case "playing":
                router.push("/play");
                break;
            /*case "won":
                router.push("/won");
                break;
            case "lost":
                router.push("/lost");
                break;*/
            default:
                return
        }
    }, [snapshot.value, router]);

    return {
        state: snapshot.value,
        context: snapshot.context,
        startGame,
        guessLetter
    };
}

export function HangmanProvider({ children }: { children: ReactNode }) {
    const value = useHangmanValue();
    return <HangmanContext.Provider value={value}>{children}</HangmanContext.Provider>;
}

export function useHangman() {
    const ctx = useContext(HangmanContext);
    if (!ctx) throw new Error("useHangman must be used within a HangmanProvider");
    return ctx;
}