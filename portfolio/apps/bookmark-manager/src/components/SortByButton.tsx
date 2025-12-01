"use client"

import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import IconSort from "@/icons/icon-sort.svg";

export function SortByButton() {

    return (
        <Popover>
            <PopoverTrigger className={`flex gap-1 py-2.5 px-3 rounded-[8px] bg-white`}>
                <IconSort />
                Sort by
            </PopoverTrigger>
            <PopoverContent>
                <div className={`flex flex-col`}>
                    <button>Recently Added</button>
                </div>
            </PopoverContent>
        </Popover>
    );
}