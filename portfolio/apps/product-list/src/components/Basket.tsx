"use client"

import data from "@/lib/state/data.json"
import IconEmpty from "@portfolio/icons/product-list/illustration-empty-cart";
import IconRemove from "@portfolio/icons/product-list/icon-remove-item";
import IconNeutral from "@portfolio/icons/product-list/icon-carbon-neutral";
import {useStore} from "@tanstack/react-store";
import {basketStore, modalOpen} from "@/lib/state/basketStore";
import {Fragment} from "react";

export function Basket() {
    const basket = useStore(basketStore)
    const hasItems = useStore(basketStore, val=>Object.values(val).filter(quantity=>quantity>0).length>0)

    const getTotal = Object.entries(basket).reduce((acc, [name,quantity])=>{
        const item = data.find(item=>item.name===name)
        return acc + (Number(item?.price)||0) * quantity
    }, 0)

    return (
        <aside className={`flex flex-col ${hasItems?"gap-6":"gap-4"} p-6 bg-white rounded-[12px] max-w-[384px] w-full`}>
            <h2 className={`text-preset-2 text-red-500 mb-1`}>Your Cart (0)</h2>
            {!hasItems && <IconEmpty className={`self-center h-32 w-32`} />}
            {!hasItems && <p className={`text-preset-4 text-rose-500 text-center`}>Your added items will appear here</p>}
            {hasItems &&<>
                <ul className={`flex flex-col gap-4`}>
                    {Object.entries(basket).map(([name, quantity])=>{
                        const item = data.find(item=>item.name===name)
                        return (
                            <Fragment key={item?.name} >
                                <li className={`flex items-center justify-between`}>
                                    <header className={`flex flex-col gap-2 text-rose-500 text-preset-4`}>
                                        <h3 className={`text-rose-900 font-semibold`}>{item?.name}</h3>
                                        <div className={`flex items-center gap-2 font-semibold`}>
                                            <span className={`text-red-500`}>{quantity}x</span>
                                            <span className={`font-normal`}>@ ${Number(item?.price)?.toFixed(2)}</span>
                                            <span>${((Number(item?.price)||0) * quantity).toFixed(2)}</span>
                                        </div>
                                    </header>
                                    <div
                                        className={`h-5 w-5 rounded-full border border-rose-400 flex items-center justify-center p-1`}>
                                        <IconRemove/>
                                    </div>
                                </li>
                                <hr/>
                            </Fragment>
                        )
                    })}
                </ul>

                <dl className={`flex justify-between items-center text-preset-4 text-rose-900`}>
                    <dt>Order Total</dt>
                    <dd className={`text-preset-2`}>${Number(getTotal).toFixed(2)}</dd>
                </dl>

                <div className={`flex items-center justify-center bg-rose-50 text-preset-4 p-4 gap-2 rounded-[8px]`}>
                    <IconNeutral/> <span>This is a <em className={`font-semibold`}>carbon-neutral</em> delivery</span>
                </div>

                <button onClick={()=>modalOpen.setState(prev=>true)}
                    className={`text-preset-3 rounded-full bg-red-500 text-white p-4 cursor-pointer`}>Confirm Order</button>
            </>}
        </aside>
    );
}