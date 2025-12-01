"use client"

import {updateSearchTerm} from "@/lib/store/bookmarkStore";

export function SearchBar() {
    return (
        <input onChange={e=>updateSearchTerm(e.target.value)} type="text"
               placeholder={`Search by title...`} className={`flex-1 bg-transparent outline-none`} />
    );
}