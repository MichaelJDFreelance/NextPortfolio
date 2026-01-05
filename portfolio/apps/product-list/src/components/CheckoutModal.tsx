"use client"

import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import {useStore} from "@tanstack/react-store";
import {basketStore, modalOpen} from "@/lib/state/basketStore";
import data from "@/lib/state/data.json";
import {Fragment} from "react";

export function CheckoutModal() {
    const open = useStore(modalOpen)
    const basket = useStore(basketStore)

    const getTotal = Object.entries(basket).reduce((acc, [name,quantity])=>{
        const item = data.find(item=>item.name===name)
        return acc + (Number(item?.price)||0) * quantity
    }, 0)

    const reset = () => {
        basketStore.setState(prev=>({}));
        modalOpen.setState(prev=>false);
    }

    return (
        <Dialog open={open} onOpenChange={val=>modalOpen.setState(prev=>val)}>
            <DialogContent showCloseButton={false} className={`p-10 flex flex-col gap-8`}>
                <DialogTitle className={`flex flex-col gap-6`}>
                    <header className={`flex flex-col gap-2`}>
                        <h1 className={`text-preset-1 text-rose-900`}>Order Confirmed</h1>
                        <p className={`text-rose-500 text-preset-3 font-normal`}>We hope you enjoy your food!</p>
                    </header>
                </DialogTitle>
                <div className={`flex flex-col gap-6 p-6 bg-rose-50`}>
                    <ul className={`flex flex-col gap-4`}>
                        {Object.entries(basket).map(([name, quantity])=>{
                            const item = data.find(item=>item.name===name)
                            return (
                                <Fragment key={item?.name} >
                                <li className={`flex items-center gap-4`}>
                                    <img src={item?.image.thumbnail} alt="Waffle" className={`rounded-[8px]`} />
                                    <header className={`flex flex-col gap-2 text-rose-500 text-preset-4`}>
                                        <h3 className={`text-rose-900 font-semibold`}>{item?.name}</h3>
                                        <div className={`flex items-center gap-2 font-semibold`}>
                                            <span className={`text-red-500`}>{quantity}x</span>
                                            <span className={`font-normal`}>@ ${Number(item?.price)?.toFixed(2)}</span>
                                        </div>
                                    </header>
                                    <span className={`ml-auto text-rose-900 text-preset-3`}>${((Number(item?.price)||0) * quantity).toFixed(2)}</span>
                                </li>
                                <hr />
                                </Fragment>
                            )
                        })}
                    </ul>
                    <hr />
                    <dl className={`flex justify-between items-center text-preset-4 text-rose-900`}>
                        <dt>Order Total</dt>
                        <dd className={`text-preset-2`}>${Number(getTotal)?.toFixed(2)}</dd>
                    </dl>
                </div>
                <button onClick={reset}
                    className={`text-preset-3 rounded-full bg-red-500 text-white p-4`}>Start New Order</button>
            </DialogContent>
        </Dialog>
    );
}