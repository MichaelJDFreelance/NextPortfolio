import HappyIcon from "@portfolio/icons/mood/icon-happy-color"
import SadIcon from "@portfolio/icons/mood/icon-sad-color"
import VeryHappyIcon from "@portfolio/icons/mood/icon-very-happy-color"
import VerySadIcon from "@portfolio/icons/mood/icon-very-sad-color"
import NeutralIcon from "@portfolio/icons/mood/icon-neutral-color"
import HappyIconBW from "@portfolio/icons/mood/icon-happy-white"
import SadIconBW from "@portfolio/icons/mood/icon-sad-white"
import VeryHappyIconBW from "@portfolio/icons/mood/icon-very-happy-white"
import VerySadIconBW from "@portfolio/icons/mood/icon-very-sad-white"
import NeutralIconBW from "@portfolio/icons/mood/icon-neutral-white"

type moods = "happy" | "sad" | "neutral" | "very-sad" | "very-happy"

type EmojiProps = {mood:moods, isColor:boolean, className?:string}

export function EmojiComponent({mood, isColor, className}:EmojiProps) {
    switch (mood) {
        case "very-sad":
            return isColor? <VerySadIcon className={className}/> : <VerySadIconBW className={className}/>
        case "sad":
            return isColor? <SadIcon className={className}/> : <SadIconBW className={className}/>
        case "neutral":
            return isColor? <NeutralIcon className={className}/> : <NeutralIconBW className={className}/>
        case "very-happy":
            return isColor? <VeryHappyIcon className={className}/> : <VeryHappyIconBW className={className}/>
        case "happy":
            return isColor? <HappyIcon className={className}/> : <HappyIconBW className={className}/>
        default:
            return isColor? <NeutralIcon className={className}/> : <NeutralIconBW className={className}/>
    }
}