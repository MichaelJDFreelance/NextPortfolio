"use client"

import {setTag} from "@/lib/store/bookmarkStore";

export function SidebarCheckbox({text, value}:any) {
    const handleCheckboxClick = (e:any) => {
        e.stopPropagation(); // 👈 stop bubbling
        setTag(e.target.value, e.target.checked)
    };

    return (
        <label key={text} className={`flex items-center gap-2 py-2 px-3`}>
            <input onClick={handleCheckboxClick} type="checkbox" id={`${text}-checkbox`} name={text} value={text}/> {text}
            <span className={`ml-auto rounded-full px-2 py-0.5 bg-neutral-100`}>{value}</span>
        </label>
    );
}