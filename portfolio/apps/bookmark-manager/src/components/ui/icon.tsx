"use client"

import IconAdd from "@/icons/icon-add.svg";
import IconPin from "@/icons/icon-pin.svg";
import IconVisitCount from "@/icons/icon-visit-count.svg";
import IconCreated from "@/icons/icon-created.svg";
import IconLastVisited from "@/icons/icon-last-visited.svg";
import IconHome from "@/icons/icon-home.svg";
import IconArchive from "@/icons/icon-archive.svg";
import IconSearch from "@/icons/icon-search.svg";
import IconTheme from "@/icons/icon-theme.svg";
import IconLogout from "@/icons/icon-logout.svg";
import IconHamburger from "@/icons/icon-menu-hamburger.svg";

type IconProps = {
    name: string
    className?: string
}

export function Icon({name, className}:IconProps) {
    switch (name) {
        case "pin":
            return <IconPin className={className} />
        case "add":
            return <IconAdd className={className} />
        case "visit-count":
            return <IconVisitCount className={className} />
        case "created":
            return <IconCreated className={className} />
        case "last-visited":
            return <IconLastVisited className={className} />
        case "home":
            return <IconHome className={className} />
        case "archive":
            return <IconArchive className={className} />
        case "search":
            return <IconSearch className={className} />
        case "theme":
            return <IconTheme className={className} />
        case "logout":
            return <IconLogout className={className} />
        case "hamburger":
            return <IconHamburger className={className} />
        default:
            return <IconAdd className={className} />
    }
}