"use client"

import {Icon} from "@/components/ui/icon";
import {useDarkMode} from "@/hooks/useDarkMode";

export function ThemeToggle() {
    const {toggleDarkMode, choseDark} = useDarkMode();

    return (
        <button className={`flex items-center`} onClick={toggleDarkMode}><Icon name={`theme`} /> Theme</button>
    );
}