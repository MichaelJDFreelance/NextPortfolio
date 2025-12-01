"use client"

import {DarkToggle} from "./DarkToggle";
import Logo from "@portfolio/icons/invoices/logo";
import {ReactNode, useState} from "react";
import {useStore} from "@tanstack/react-form";
import {hideForm, InvoiceStore} from "../lib/store/invoiceStore";

export function Sidebar({children}:{children?: ReactNode}) {
    const showForm = useStore(InvoiceStore, s=>s.showForm)

    return (
        <aside className={`absolute`}>
            <div onClick={()=>hideForm()} className={`cursor-pointer absolute bg-black/50 w-screen 
                h-screen ${!showForm && "hidden"}`}></div>
            <div className={`absolute flex bg-white ${!showForm && "hidden"}
                h-screen pl-[140px] pr-10 w-[719px] overflow-y-scroll`}>
                {children}
            </div>
            <menu className={`absolute overflow-hidden flex flex-col gap-7 items-center h-screen w-[103px] rounded-r-[20px] pb-6 
                dark-theme:bg-sidebar-dark bg-sidebar`}>
                <div className={`w-full p-8 bg-primary`}>
                    <Logo className={`w-10 h-10`} />
                </div>
                <DarkToggle className={`mt-auto`} />
                <hr className={`text-[hsla(231, 20%, 36%, 1)] w-full`} />
                <img src={`/image-avatar.jpg`} alt={`logo`} className={`w-10 h-10 rounded-full`} />
            </menu>
        </aside>
    );
}