"use client"

import {useEffect, useState} from "react";
import {durationDerived, settingsStore} from "@/lib/state/settingsStore";
import {useStore} from "@tanstack/react-store";

export function Pomodoro() {
    const settings = useStore(settingsStore);
    const duration = useStore(durationDerived, val=>val*60);

    const r = 80;
    const C = 2 * Math.PI * r;
    const fps = 100;

    const [circ, setCirc] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(()=>{
        if (isPaused) return;

        const i = setInterval(()=>{
            setCirc(circ=>circ-C/(duration*fps));
        }, 1000/fps)
        return ()=>clearInterval(i)
    }, [C, duration, isPaused, fps])

    const remaining = (1- Math.abs((circ/C)%1)) * duration;

    const secondsToMinutes = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    return (
        <div data-theme={settings.theme} data-font={settings.font}
             className={`relative rounded-full box-shadow text-theme font-sans
             data-[font=serif]:font-serif data-[font=mono]:font-mono`}>
            <svg width="300" height="300" viewBox="0 0 200 200" className={``}>
                <circle
                    cx="100"
                    cy="100"
                    r={r}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeDasharray={C}
                    strokeDashoffset={circ}
                    strokeLinecap={`round`}
                />
            </svg>
            <div className={`absolute inset-0 flex flex-col items-center justify-center text-white`}>
                <div className={`text-large`}>{secondsToMinutes(remaining)}</div>
                <button className={`hover:text-theme cursor-pointer`} onClick={()=>setIsPaused(!isPaused)}>Pause</button>
            </div>
        </div>
    );
}