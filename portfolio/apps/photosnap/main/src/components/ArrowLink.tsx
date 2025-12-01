import {ReactNode} from "react";
import Arrow from "@/icons/arrow.svg"

export const ArrowLink = ({text, className, colorStyle}:{text:ReactNode, className?: string, colorStyle?:"light"|"dark"}) => {
    return (
        <a className={`text-preset-4 flex items-center gap-5 ${className}`}>
            {text} <Arrow className={`${colorStyle==="light" && "!stroke-white"}`} />
        </a>
    );
};