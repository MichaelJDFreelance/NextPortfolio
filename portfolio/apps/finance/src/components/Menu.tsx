"use client"

import IconOverview from "@portfolio/icons/finance/icon-nav-overview";
import IconTransactions from "@portfolio/icons/finance/icon-nav-transactions";
import IconBudgets from "@portfolio/icons/finance/icon-nav-budgets";
import IconPots from "@portfolio/icons/finance/icon-nav-pots";
import IconBills from "@portfolio/icons/finance/icon-nav-recurring-bills";
import IconCloseModal from "@portfolio/icons/finance/icon-close-modal";
import Logo from "@portfolio/icons/finance/logo-large";
import {usePathname} from "next/navigation";

export function Menu() {
    const pathname = usePathname();

    return (
        <nav className={`flex xl:flex-col bg-accent`}>
            <Logo className={`max-xl:hidden`} />
            <ul className={`flex xl:flex-col max-xl:flex-1 w-full max-xl:justify-between pt-2 px-10`}>
                <li className={`w-17 data-[selected=true]:bg-background flex flex-col items-center py-2 rounded-t border-b-2 border-theme`}
                    data-selected={pathname === '/'}>
                <a className={`cursor-pointer`} href={`/`}><IconOverview /></a>
                </li>
                <li className={`w-17 data-[selected=true]:bg-background flex flex-col items-center py-2 rounded-t border-b-2 border-theme`}
                    data-selected={pathname === '/transactions'}>
                <a className={`cursor-pointer`} href={`/transactions`}><IconTransactions /></a>
                </li>
                <li className={`w-17 data-[selected=true]:bg-background flex flex-col items-center py-2 rounded-t border-b-2 border-theme`}
                    data-selected={pathname === '/budgets'}>
                <a className={`cursor-pointer`} href={`/budgets`}><IconBudgets /></a>
                </li>
                <li className={`w-17 data-[selected=true]:bg-background flex flex-col items-center py-2 rounded-t border-b-2 border-theme`}
                    data-selected={pathname === '/pots'}>
                <a className={`cursor-pointer`} href={`/pots`}><IconPots /></a>
                </li>
                <li className={`w-17 data-[selected=true]:bg-background flex flex-col items-center py-2 rounded-t border-b-2 border-theme`}
                    data-selected={pathname === '/bills'}>
                <a className={`cursor-pointer`} href={`/bills`}><IconBills /></a>
                </li>
            </ul>
            <button className={`mt-auto`}><IconCloseModal /></button>
        </nav>
    );
}