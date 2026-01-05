"use client"

import IconBasket from "@portfolio/icons/product-list/icon-add-to-cart";
import IconMinus from "@portfolio/icons/product-list/icon-decrement-quantity"
import IconPlus from "@portfolio/icons/product-list/icon-increment-quantity"
import {useStore} from "@tanstack/react-store";
import {addOne, basketStore, minusOne} from "@/lib/state/basketStore";

export function AddButton({name}:{name:string}) {
    const quantity = useStore(basketStore, val=>val[name])

    return (
        <span className={`flex justify-center group`}>
            <button onClick={()=>addOne(name)}
                className={`flex ${quantity>0&&"hidden"} items-center gap-2 justify-center -mt-6 bg-white 
                  rounded-full p-3 border border-rose-400 max-w-[148px] w-full self-center text-rose-900 
                  font-semibold`}>
            <IconBasket />Add to Cart</button>
            <button className={`flex cursor-pointer ${(!quantity || quantity<=0)&&"hidden"} items-center gap-2 justify-between -mt-6 
                      bg-red-500 rounded-full p-3 border border-rose-400 max-w-[160px] w-full self-center text-rose-900 
                      font-semibold text-white`}>
                <div onClick={()=>minusOne(name)}
                    className={`group/nested hover:bg-white  h-5 w-5 border border-white flex items-center justify-center 
                        p-1 rounded-full`}>
                    <IconMinus className={`stroke-white group-hover/nested:stroke-red-500`}/>
                </div> {quantity || 0}
                <div onClick={()=>addOne(name)}
                    className={`group/nested hover:bg-white h-5 w-5 border border-white flex items-center justify-center 
                        p-1 rounded-full`}>
                    <IconPlus className={`stroke-white group-hover/nested:stroke-red-500`}/>
                </div>
            </button>
        </span>
    );
}