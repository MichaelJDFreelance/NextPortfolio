"use client"

import Link from "next/link";
import {cn} from "@/lib/utils";
import {formService} from "@/lib/state/formMachine";

export function Menu() {
    const menuNumberStyle = `before:rounded-full before:aspect-square before:p-2 before:bg-sidebar-accent before:text-accent 
        before:flex before:items-center before:justify-center before:row-span-2 before:font-bold`;

    return (
        <nav className={`min-h-43 w-full flex md:flex-col md:gap-8 rounded-lg bg-primary text-sidebar-foreground md:px-8 md:py-10 md:w-82.5
          bg-[url(/images/bg-sidebar-mobile.svg)] md:bg-[url(/images/bg-sidebar-desktop.svg)] pt-10 bg-bottom bg-no-repeat bg-contain text-preset-4 max-md:justify-center`}>
            <button onClick={() => formService.send({
                type: "GO_TO_STAGE",
                stage: "personalInfo",
            })} className={cn("h-fit w-fit text-left cursor-pointer grid grid-cols-[auto_1fr] gap-x-4 before:content-['1']", menuNumberStyle)}>
                <span className={`text-preset-5 max-md:hidden`}>STEP 1</span>
                <span className={`text-white text-preset-4 max-md:hidden`}>YOUR INFO</span>
            </button>
            <button onClick={() => formService.send({
                type: "GO_TO_STAGE",
                stage: "plan",
            })} className={cn("h-fit w-fit text-left cursor-pointer grid grid-cols-[auto_1fr] gap-x-4 before:content-['2']", menuNumberStyle)}>
                <span className={`text-preset-5 max-md:hidden`}>STEP 2</span>
                <span className={`text-white text-preset-4 max-md:hidden`}>SELECT PLAN</span>
            </button>
            <Link href="/" className={cn("h-fit w-fit text-left cursor-pointer grid grid-cols-[auto_1fr] gap-x-4 before:content-['3']", menuNumberStyle)}>
                <span className={`text-preset-5 max-md:hidden`}>STEP 3</span>
                <span className={`text-white text-preset-4 max-md:hidden`}>ADD-ONS</span>
            </Link>
            <button onClick={() => formService.send({
                type: "GO_TO_STAGE",
                stage: "summary",
            })} className={cn("h-fit w-fit text-left cursor-pointer grid grid-cols-[auto_1fr] gap-x-4 before:content-['4']", menuNumberStyle)}>
                <span className={`text-preset-5 max-md:hidden`}>STEP 4</span>
                <span className={`text-white text-preset-4 max-md:hidden`}>SUMMARY</span>
            </button>
        </nav>
    );
}