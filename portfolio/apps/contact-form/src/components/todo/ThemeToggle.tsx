"use client"

import {useDarkMode} from "@/hooks/useDarkMode";
import SunIcon from "@/icons/todo/icon-sun.svg";
import MoonIcon from "@/icons/todo/icon-moon.svg";

export function ThemeToggle() {
    const {toggleDarkMode, choseDark} = useDarkMode();

    return (
        <button className={`flex dark-theme:text-white h-fit translate-y-[20px]`} onClick={toggleDarkMode}>{choseDark?<SunIcon />:<MoonIcon />}</button>
    );
}