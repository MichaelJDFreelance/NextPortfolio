"use client"

import IconTV from "@portfolio/icons/movies/icon-nav-tv-series";
import IconMovies from "@portfolio/icons/movies/icon-nav-movies";
import IconHome from "@portfolio/icons/movies/icon-nav-home";
import IconBookmark from "@portfolio/icons/movies/icon-nav-bookmark";
import Logo from "@portfolio/icons/movies/logo";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import Link from "next/link";

export function NavBar() {
    const nextPage = usePathname();

    return (
        <nav className={`flex xl:flex-col gap-8 xl:gap-10 items-center p-5 xl:px-7 xl:py-8.5 bg-sidebar`}>
            <Logo className={`h-5 w-5`} />
            <Link data-active={nextPage==="/"} href={"/"}
               className={cn("text-sidebar-foreground hover:text-primary cursor-pointer data-[active=true]:text-foreground")}>
                <IconHome className={`h-5 w-5`} /></Link>
            <Link data-active={nextPage==="/movies"} href={"/movies"}
               className={cn("text-sidebar-foreground hover:text-primary cursor-pointer data-[active=true]:text-foreground")}>
                <IconMovies className={`h-5 w-5`}/>
            </Link>
            <Link data-active={nextPage==="/tv"} href={"/tv"}
               className={cn("text-sidebar-foreground hover:text-primary cursor-pointer data-[active=true]:text-foreground")}>
                <IconTV className={`h-5 w-5`} />
            </Link>
            <Link data-active={nextPage==="/bookmarks"} href={"/bookmarks"}
               className={cn("text-sidebar-foreground hover:text-primary cursor-pointer data-[active=true]:text-foreground")}>
                <IconBookmark className={`h-5 w-5`} />
            </Link>
            <picture className={`ml-auto xl:mt-auto`}>
                <img src="/assets/image-avatar.png" alt={`avatar`} />
            </picture>
        </nav>
    );
}