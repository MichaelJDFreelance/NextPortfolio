"use client"

import IconArrowUp from "@/icons/icon-arrow-up.svg";
import IconComments from "@/icons/icon-comments.svg";

type IconProps = {
    name:string,
    className?:string
}

export function Icon({name, className}:IconProps) {
    switch (name) {
        case "arrow-up":
            return <IconArrowUp className={className} />;
        case "comments":
            return <IconComments className={className} />
        default:
            return (<>Icon not found</>)
    }
}