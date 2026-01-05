import {useDarkMode} from "@portfolio/dark-mode";
import IconSunDark from "@portfolio/icons/quiz/icon-sun-dark"
import IconMoonLight from "@portfolio/icons/quiz/icon-moon-light"
import IconSunLight from "@portfolio/icons/quiz/icon-sun-light"
import IconMoonDark from "@portfolio/icons/quiz/icon-moon-dark"
import {Switch} from "@/components/ui/switch";


export function DarkSwitch() {
    const {choseDark, toggleDarkMode} = useDarkMode()

    return (
        <div className={`flex items-center gap-4 ml-auto`}>
            {choseDark ? <IconMoonLight className={`h-5 w-5`} /> : <IconMoonDark className={`h-5 w-5`} />}
            <Switch checked={choseDark} onCheckedChange={toggleDarkMode} className={`h-5 w-10 cursor-pointer`} />
            {choseDark ? <IconSunLight className={`h-5 w-5`} /> : <IconSunDark className={`h-5 w-5`} />}
        </div>
    );
}