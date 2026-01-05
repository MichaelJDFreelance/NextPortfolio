"use client"

import {Entertainment} from "@/lib/types";
import {cn} from "@/lib/utils";
import {CategoryIcon} from "@/components/CategoryIcon";
import IconPlay from "@portfolio/icons/movies/icon-play";
import IconBookmark from "@portfolio/icons/movies/icon-bookmark-empty";
import IconBookmarkFull from "@portfolio/icons/movies/icon-bookmark-full";
import {bookmarkStore, toggleBookmark} from "@/lib/state/movieStore";
import {useStore} from "@tanstack/react-store";

export function InfoBar({item, useOverlay}: { item:Entertainment, useOverlay?:boolean }) {
    return (
        <div className={cn("flex flex-col gap-2 mt-2 text-preset-5", useOverlay?"absolute bottom-5 left-5":"")}>
            <div className={`flex items-center gap-2`}>
                <span className={`opacity-75`}>{item.year}</span>
                <div className={`h-1 w-1 rounded-full bg-current rounded-full opacity-50`} />
                <span className={`flex gap-1 items-center opacity-75`}><CategoryIcon category={item.category} /> {item.category}</span>
                <div className={`h-1 w-1 rounded-full bg-current rounded-full opacity-50`} />
                <span className={`opacity-75`}>{item.rating}</span>
            </div>
            <h2 className={cn(useOverlay?"text-preset-2":"text-preset-3")}>{item.title}</h2>
        </div>
    )
}

export function Item({item, useOverlay}: { item:Entertainment, useOverlay?:boolean }) {
    const bookmarks = useStore(bookmarkStore)

    return (
        <div key={item.title} className={cn("relative", useOverlay&&"shrink-0 h-[238px] w-[470px]")}>
            <div className={`relative group cursor-pointer`}>
                <picture className={``}>
                    <img alt={item.title} src={useOverlay?item.thumbnail.trending?.large:item.thumbnail.regular.large} className={``} />
                </picture>
                <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <div className={`flex items-center gap-4 bg-white/25 rounded-full p-2 pr-6`}>
                        <IconPlay className={`h-7.5 w-7.5`} />
                        Play
                    </div>
                </div>
                <button onClick={toggleBookmark(item.id)} className={`absolute top-5 right-5 flex items-center justify-center p-2 bg-white/25 rounded-full`}>
                    {item.id&&bookmarks.includes(item.id)?<IconBookmarkFull className={`h-3.5 w-3`}/>:<IconBookmark className={`h-3.5 w-3`}/>}
                </button>
            </div>
            <InfoBar item={item} useOverlay={useOverlay} />
        </div>
    )
}