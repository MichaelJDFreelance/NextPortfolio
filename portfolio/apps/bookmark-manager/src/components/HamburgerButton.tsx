"use client"

import {mergeUpdateDynamicComponentStore} from "@/lib/store/dynamicComponentStore";
import {Icon} from "@/components/ui/icon";
import {WithClassNameProps} from "@/types";

export function HamburgerButton({className}:WithClassNameProps) {
    return (
        <button onClick={()=>mergeUpdateDynamicComponentStore("sidebar-container",
            {"data-selected": "true"})} className={`flex gap-1 py-2.5 px-3 rounded-[8px] bg-white ${className}`}>
            <Icon name={`hamburger`} /></button>
    );
}