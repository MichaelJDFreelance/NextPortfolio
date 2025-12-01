"use client"

import Image from "next/image"
import IconMenuBookmark from "@/icons/icon-menu-bookmark.svg";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Icon} from "@/components/ui/icon";
import {DateTime} from "luxon";
import {mutateStore} from "@/lib/store/mutateStore";

export function Bookmark({bookmark}:{bookmark:any}) {
    return (
        <div className={`flex flex-col gap-4 p-4 pb-0 rounded-[10px] bg-white w-[21.5rem]`}>
            <header className={`flex items-center gap-x-4 w-full`}>
                <Image className={`w-11 h-11`} width={44} height={44} alt={bookmark?.title}
                       src={bookmark?.favicon?.replace('.', '')||''}></Image>
                <header className={`flex-1`}>
                    <h2 className={`text-preset-2 text-neutral-900`}>{bookmark?.title}</h2>
                    <span className={`w-11 h-11`}>{bookmark.url}</span>
                </header>
                <Popover>
                    <PopoverTrigger>
                        <IconMenuBookmark />
                    </PopoverTrigger>
                    <PopoverContent>
                        <button onClick={()=>mutateStore.setState({id:bookmark?.id, state: "open"})}>Edit</button>
                    </PopoverContent>
                </Popover>
            </header>
            <hr />
            <p className={`text-preset-4-medium`}>{bookmark?.description}</p>
            <ul className={`flex gap-2 text-preset-5`}>
                {bookmark?.tags?.map((tag:any) => (
                    <li key={tag} className={`px-2 py-0.5 bg-neutral-100 rounded-[4px]`}>{tag}</li>
                ))}
            </ul>
            <footer className={`flex gap-4 px-4 py-3 text-preset-5`}>
                <span className={`flex items-center gap-1.5`}>
                    <Icon name={`visit-count`} /> {bookmark.visitCount}</span>
                <span className={`flex items-center gap-1.5`}>
                    <Icon name={`created`} />{DateTime.fromISO(bookmark.createdAt).toFormat("d MMM")}</span>
                <span className={`flex items-center gap-1.5`}>
                    <Icon name={`last-visited`} />{DateTime.fromISO(bookmark.lastVisited).toFormat("d MMM")}</span>
                <span className={`flex items-center gap-1.5 ml-auto`}>
                    <Icon name={`pin`} className={`!fill-white !stroke-white`} /></span>
            </footer>
        </div>
    );
}