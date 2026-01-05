"use client"

import LogoLight from "@portfolio/icons/character-counter/logo-light-theme"
import LogoDark from "@portfolio/icons/character-counter/logo-dark-theme"
import IconSun from "@portfolio/icons/character-counter/icon-sun"
import IconMoon from "@portfolio/icons/character-counter/icon-moon"
import {useDarkMode} from "@portfolio/dark-mode";

export function Header() {
    const {choseDark, toggleDarkMode} = useDarkMode()

    return (
        <header className={`flex items-center justify-between max-w-[1000px] mt-8 mb-12`}>
            {choseDark? <LogoLight/>: <LogoDark />}
            <button className={`h-11 w-11 flex items-center justify-center rounded-[8px] bg-neutral-100 dark:bg-neutral-700`}
                    onClick={()=>toggleDarkMode()}>{choseDark? <IconSun/>: <IconMoon />}</button>
        </header>
    );
}