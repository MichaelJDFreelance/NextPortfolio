import {ReactNode} from "react";
import {ContextWrapper} from "@/context/ContextWrapper";
import {UnitsMenu} from "@/components/UnitsMenu";

export default function PublicLayout({children}:{children:ReactNode}) {
    return (
        <ContextWrapper>
            <div className="min-h-screen bg-neutral-900 p-4 grid gap-12 content-start text-neutral-0">
                <header className={`w-full mx-auto flex items-center justify-between`}>
                <span className={`text-logo text-neutral-0`}>
                    Weather Now
                </span>
                    <UnitsMenu />
                </header>
                {children}
            </div>
        </ContextWrapper>
    );
}