"use client"

import {Switch} from "@/components/ui/switch";
import {useState} from "react";

export function ChoosePlan() {
    const [yearlyChosen, setChosen] = useState<boolean>(false);

    return (
        <article className={`flex flex-col gap-10 items-center text-preset-1`}>
            <span data-chosen={yearlyChosen} className={`flex items-center gap-8 group`}>
                <span className={`group-data-[chosen=true]:opacity-50`}>Monthly</span>
                <Switch className={`plan-length`} checked={yearlyChosen} onCheckedChange={() => setChosen(!yearlyChosen)} />
                <span className={`group-data-[chosen=false]:opacity-50`}>Yearly</span>
            </span>
            <div>
                <div className={`flex md:items-center max-xl:flex-col gap-6`}>
                    <div className={`grid md:max-xl:grid-areas-[header_price|cta_price] md:max-xl:grid-cols-2 gap-10 
                    items-center max-md:text-center xl:text-center px-9 max-xl:mx-7 py-14 bg-[#F5F5F5]`}>
                        <header className={`flex flex-col max-md:items-center xl:items-center gap-4.5 md:max-xl:grid-area-[header]`}>
                            <h2 className={`text-preset-h3`}>Basic</h2>
                            <p className={`max-w-[30ch] text-preset-2 opacity-60 !leading-[25px]`}>
                                Includes basic usage of our platform. Recommended for new and aspiring photographers.
                            </p>
                        </header>
                        <div className={`flex flex-col text-preset-h1 md:max-xl:grid-area-[price] md:max-xl:text-end md:max-xl:self-start`}>
                            {yearlyChosen?"$190.00":"$19.00"} <span className={`text-preset-2 opacity-60`}>{yearlyChosen?"per year":"per month"}</span>
                        </div>
                        <button className={`bg-black text-white p-3 text-preset-4 w-full md:max-xl:grid-area-[cta]`}>PICK PLAN</button>
                    </div>
                    <div className={`relative grid md:max-xl:grid-areas-[header_price|cta_price] md:max-xl:grid-cols-2 gap-10 
                    items-center max-md:text-center xl:text-center px-9 max-xl:mx-7 py-14 xl:py-22 bg-black text-white`}>
                        <div className={`absolute bg-gradient-to-tr from-yellow-500 via-pink-800 to-blue-500 h-2 w-full top-0`}></div>
                        <header className={`flex flex-col max-md:items-center xl:items-center gap-4.5 md:max-xl:grid-area-[header]`}>
                            <h2 className={`text-preset-h3`}>Pro</h2>
                            <p className={`max-w-[30ch] text-preset-2 opacity-60 !leading-[25px]`}>
                                More advanced features available. Recommended for photography veterans and professionals.
                            </p>
                        </header>
                        <div className={`flex flex-col text-preset-h1 md:max-xl:grid-area-[price] md:max-xl:text-end md:max-xl:self-start`}>
                            {yearlyChosen?"$390.00":"$39.00"} <span className={`text-preset-2 opacity-60`}>{yearlyChosen?"per year":"per month"}</span>
                        </div>
                        <button className={`p-3 text-preset-4 w-full md:max-xl:grid-area-[cta] bg-white text-black`}>PICK PLAN</button>
                    </div>
                    <div className={`grid md:max-xl:grid-areas-[header_price|cta_price] md:max-xl:grid-cols-2 gap-10 
                    items-center max-md:text-center xl:text-center px-9 max-xl:mx-7 py-14 bg-[#F5F5F5]`}>
                        <header className={`flex flex-col max-md:items-center xl:items-center gap-4.5 md:max-xl:grid-area-[header]`}>
                            <h2 className={`text-preset-h3`}>Business</h2>
                            <p className={`max-w-[30ch] text-preset-2 opacity-60 !leading-[25px]`}>
                                Additional features available such as more detailed metrics. Recommended for business owners.
                            </p>
                        </header>
                        <div className={`flex flex-col text-preset-h1 md:max-xl:grid-area-[price] md:max-xl:text-end md:max-xl:self-start`}>
                            {yearlyChosen?"$990.00":"$99.00"} <span className={`text-preset-2 opacity-60`}>{yearlyChosen?"per year":"per month"}</span>
                        </div>
                        <button className={`bg-black text-white p-3 text-preset-4 w-full md:max-xl:grid-area-[cta]`}>PICK PLAN</button>
                    </div>
                </div>
            </div>
        </article>
    );
}