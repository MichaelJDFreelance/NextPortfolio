"use client"

import IconTag from "@portfolio/icons/note-taking/icon-tag"
import IconHome from "@portfolio/icons/note-taking/icon-home"
import IconArchive from "@portfolio/icons/note-taking/icon-archive"
import Logo from "@portfolio/icons/note-taking/logo"
import {tagsArray} from "@/lib/state/notesStore";
import {useStore} from "@tanstack/react-store";

export function Menu() {
    const tags = useStore(tagsArray)

    return (
        <div className={`flex flex-col-reverse xl:flex-col gap-2 px-4 py-3 border-r min-w-[272px]`}>
            <Logo className={`mb-2 h-7 w-24 max-xl:hidden`} />
            <div className={`flex xl:flex-col gap-1`}>
                <a className={`flex gap-2 py-2.5 px-3 rounded items-center`}><IconHome /> All Notes</a>
                <a className={`flex gap-2 py-2.5 px-3 rounded items-center`}><IconArchive /> Archived Notes</a>
            </div>
            <hr />
            <div className={`flex flex-col gap-2 max-xl:hidden`}>
                <h2 className={`mx-2 text-muted-foreground`}>Tags</h2>
                <ul className={`flex flex-col gap-2`}>
                    {tags.map(tag=>(
                        <li key={tag} className={`flex gap-2 py-2.5 px-3 rounded items-center`}><IconTag /> {tag}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}