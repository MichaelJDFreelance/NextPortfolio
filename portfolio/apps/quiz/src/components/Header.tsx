"use client"

import {DarkSwitch} from "@/components/DarkSwitch";
import { useParams } from "next/navigation";
import IconHtml from "@portfolio/icons/quiz/icon-html";
import IconCss from "@portfolio/icons/quiz/icon-css";
import IconJs from "@portfolio/icons/quiz/icon-js";
import IconAccessibility from "@portfolio/icons/quiz/icon-accessibility";

function CategoryIcon({category}:{category:string}) {
    switch (category) {
        case "accessibility": return (
            <div className={`flex items-center justify-center h-14 w-14 rounded-[8px] bg-[hsla(278, 100%, 95%, 1)]`}>
                <IconAccessibility />
            </div>
        );
        case "html": return (
            <div className={`flex items-center justify-center h-14 w-14 rounded-[8px] bg-[hsla(278, 100%, 95%, 1)]`}>
                <IconHtml />
            </div>
        );
        case "css": return (
            <div className={`flex items-center justify-center h-14 w-14 rounded-[8px] bg-[hsla(278, 100%, 95%, 1)]`}>
                <IconCss />
            </div>
        );
        case "js": return (
            <div className={`flex items-center justify-center h-14 w-14 rounded-[8px] bg-primary`}>
                <IconJs />
            </div>
        );
        default: return (
            <></>
        );
    }
}

function CategoryBadge({category}:{category:string}) {
    switch (category) {
        case "accessibility": return (
            <div className={`flex items-center gap-6 text-preset-4 text-primary-foreground`}>
                <CategoryIcon category={category} /> Accessibility
            </div>
        );
        case "html": return (
            <div className={`flex items-center gap-6 text-preset-4 text-primary-foreground`}>
                <CategoryIcon category={category} /> HTML
            </div>
        );
        case "css": return (
            <div className={`flex items-center gap-6 text-preset-4 text-primary-foreground`}>
                <CategoryIcon category={category} /> CSS
            </div>
        );
        case "js": return (
            <div className={`flex items-center gap-6 text-preset-4 text-primary-foreground`}>
                <CategoryIcon category={category} /> JS
            </div>
        );
        default: return (
            <></>
        );
    }
}

export function Header() {
    const params = useParams();

    return (
        <header className={`m-21 w-full flex max-w-[1160px]`}>
            <CategoryBadge category={params.category as string} />
            <DarkSwitch /></header>
    );
}