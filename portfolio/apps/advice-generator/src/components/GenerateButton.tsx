"use client"

import IconDie from "@portfolio/icons/advice-generator/icon-dice"
import {setQuote} from "@/lib/adviceStore";

export function GenerateButton() {
    return (
        <button onClick={setQuote}
            className={`flex items-center justify-center hover:box-shadow cursor-pointer h-16 w-16 bg-primary 
                            rounded-full absolute bottom-0 translate-y-[50%]`}>
            <IconDie className={`w-6 h-6`} />
        </button>
    );
}