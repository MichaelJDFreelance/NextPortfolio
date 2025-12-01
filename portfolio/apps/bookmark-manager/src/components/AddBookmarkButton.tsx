"use client"

import {mutateStore} from "@/lib/store/mutateStore";
import {Icon} from "@/components/ui/icon";

export function AddBookmarkButton() {
    return (
        <button onClick={()=>mutateStore.setState({id:undefined, state: "open"})}
                className={`flex items-center gap-1 rounded-[8px] py-3 px-4 bg-teal-700 text-white`}>
            <Icon name={`add`} className={`stroke-white fill-white`} />Add Bookmark</button>
    );
}