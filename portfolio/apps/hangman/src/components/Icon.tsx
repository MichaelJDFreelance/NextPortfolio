"use client"

import PlayIcon from "/icons/icon-play.svg";

type Icon = "play"

export function Icon({name}:{name:Icon}) {
    switch(name) {
        case "play":
            return <PlayIcon />;
        default:
            return <></>

    }
}