"use client"

import Link from "next/link";
import Image from "next/image";
import {WithClassNameProps} from "@/types";
import {Icon} from "@/components/ui/icon";
import {SidebarCheckbox} from "@/components/SidebarCheckbox";
import {filteredTags} from "@/lib/store/bookmarkStore";
import {useStore} from "@tanstack/react-store";

type SidebarProps = WithClassNameProps

export function Sidebar({className}:SidebarProps) {
    const tags = useStore(filteredTags)

    return (
        <menu className={`flex flex-col gap-4 px-4 text-preset-3 text-neutral-800 dark-theme:bg-neutral-900 ${className}`}>
            <Image className={`p-5 pb-2.5`} alt={"Bookmark Manager"} src="/images/logo-light-theme.svg"
                   width={"214"} height={"32"}  />
            <section className={`flex flex-col`}>
                <Link href={``} className={`rounded-[6px] flex items-center gap-2 px-3 py-2 hover:bg-neutral-100`} >
                    <Icon name={`home`} /> Home</Link>
                <Link href={``} className={`rounded-[6px] flex items-center gap-2 px-3 py-2 hover:bg-neutral-100`} >
                    <Icon name={`archive`} /> Archived</Link>
            </section>
            <form className={``}>
                <h2 className={`px-3`}>TAGS</h2>
                <div>
                    {Object.entries(tags || {})?.map(([key, value]) => (
                        <SidebarCheckbox key={key} text={key} value={value} />
                    ))}
                </div>
            </form>
        </menu>
    );
}