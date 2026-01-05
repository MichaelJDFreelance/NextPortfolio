import {ReactNode} from "react";
import {LetsTalk} from "@/components/sections/contact/LetsTalk";

export default function Layout({children}:{children:ReactNode}) {
    return (
        <main className="flex w-full flex-col items-center gap-15 text-preset-4 font-sans">
            {children}

            <LetsTalk />
        </main>
    );
}