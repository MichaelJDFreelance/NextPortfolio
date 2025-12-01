"use client"

import WholeFoodIcon from "@/icons/icon-whole-food-recipes.svg";
import MinimumFussIcon from "@/icons/icon-minimum-fuss.svg";
import SearchSecondsIcon from "@/icons/icon-search-in-seconds.svg";
import ServingsIcon from "@/icons/icon-servings.svg";
import PrepTimeIcon from "@/icons/icon-prep-time.svg";
import CookTimeIcon from "@/icons/icon-cook-time.svg";

type IconProps = {
    name: "whole-food" | "servings" | "prep-time" | "cook-time" | "minimum-fuss" | "search-in-seconds"
    className?: string
}

export function Icon({name, className}:IconProps) {
    switch (name) {
        case "whole-food":
            return <WholeFoodIcon className={className} />
        case "servings":
            return <ServingsIcon className={className} />
        case "prep-time":
            return <PrepTimeIcon className={className} />
        case "cook-time":
            return <CookTimeIcon className={className} />
        case "minimum-fuss":
            return <MinimumFussIcon className={className} />
        case "search-in-seconds":
            return <SearchSecondsIcon className={className} />
        default:
            return <WholeFoodIcon className={className} />
    }
}