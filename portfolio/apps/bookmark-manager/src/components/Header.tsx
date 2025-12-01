import {WithClassNameProps} from "@/types";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import Image from "next/image";
import {ThemeToggle} from "@/components/ThemeToggle";
import {LogoutButton} from "@/components/LogoutButton";
import {HamburgerButton} from "@/components/HamburgerButton";
import {SearchBar} from "@/components/SearchBar";
import {AddBookmarkButton} from "@/components/AddBookmarkButton";

type HeaderProps = WithClassNameProps

export function Header({className}:HeaderProps) {
    return (
        <div className={`flex items-center gap-4 px-8 py-4 dark-theme:bg-neutral-800 dark-theme:text-white ${className}`}>
            <HamburgerButton className={`lg:hidden`} />
            <SearchBar />
            <AddBookmarkButton />
            <Popover>
                <PopoverTrigger><Image height={40} width={40} alt={`avatar`} src={`/images/image-avatar.webp`} /></PopoverTrigger>
                <PopoverContent>
                    <div className={`flex flex-col`}>
                        <div>
                            <ThemeToggle />
                        </div>
                        <div>
                            <LogoutButton />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}