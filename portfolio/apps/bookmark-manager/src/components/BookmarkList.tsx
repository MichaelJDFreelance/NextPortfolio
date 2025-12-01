"use client"

import {Bookmark} from "@/components/Bookmark";
import {SortByButton} from "@/components/SortByButton";
import {bookmarkStore, filteredBookmarks} from "@/lib/store/bookmarkStore";
import {useStore} from "@tanstack/react-store";

export function BookmarkList({bookmarks}:{bookmarks:any[]}) {
    const filtered = useStore(filteredBookmarks)

    bookmarkStore.setState(prev=>{
        return {
            ...prev,
            bookmarks
        }
    })

    return (
        <>
            <header className={`flex items-center justify-between`}>
                <h1 className={`text-preset-1 group-data-[light-selected=false]:text-white 
                    dark:not-group-data-[light-selected=true]:text-white`}>All bookmarks</h1>
                <SortByButton />
            </header>
            <ul className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`}>
                {filtered.map((bookmark:any) => (
                    <li key={bookmark.id}><Bookmark bookmark={bookmark}/></li>
                ))}
            </ul>
        </>
    );
}