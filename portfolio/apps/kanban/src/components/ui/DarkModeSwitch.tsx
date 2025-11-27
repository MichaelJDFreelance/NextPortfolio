"use client"

import {useDarkMode} from "@portfolio/dark-mode"
import {Switch} from "@/components/ui/switch";

export function DarkModeSwitch() {
    const {choseDark, toggleDarkMode} = useDarkMode();

    return (
        <Switch className={`translate-y-[2px]`} checked={choseDark} onCheckedChange={toggleDarkMode} />
    );
}