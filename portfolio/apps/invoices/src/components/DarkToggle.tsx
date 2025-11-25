"use client"

import {useDarkMode} from "@portfolio/dark-mode";
import IconMoon from "@portfolio/icons/invoices/icon-moon";
import IconSun from "@portfolio/icons/invoices/icon-sun";

export function DarkToggle({className}: { className?: string}) {
    const { choseDark, toggleDarkMode } = useDarkMode()

    return (
        <>
            {choseDark?
                <button onClick={toggleDarkMode} className={`cursor-pointer ${className}`}><IconMoon /></button>:
                <button onClick={toggleDarkMode} className={`cursor-pointer ${className}`}><IconSun /></button>}
        </>
    );
}