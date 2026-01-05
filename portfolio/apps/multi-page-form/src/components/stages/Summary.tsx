"use client"

import {useStore} from "@tanstack/react-store";
import {formStore} from "@/lib/state/formMachine";
import {usePricing} from "@/app/hooks/usePricing";
import {calculateTotal} from "@/lib/utils";
import {useMemo} from "react";

export function Summary() {
    const snapshot = useStore(formStore, (s) => s.snapshot);

    const {data} = usePricing();

    const pricing = snapshot?.context.plan.yearly? data?.annual : data?.monthly;

    const plan = pricing?.plans?.find(plan=>plan.id===snapshot?.context?.plan?.type);

    const [online, storage, profile] = pricing?.addons||[];

    const yearly = snapshot?.context?.plan?.yearly;

    const total = useMemo(()=>{
        if (!plan || !online || !storage || !profile || !snapshot?.context.addOns) throw new Error("Invalid pricing");
        return calculateTotal({plan, addons:[online, storage, profile], selectedAddOns:snapshot?.context.addOns})
    }, [plan, online, storage, profile, snapshot?.context.addOns])

    return (
        <div className={`flex flex-col gap-10`}>
            <header className={`flex flex-col gap-2`}>
                <h1 className={`text-accent text-preset-1`}>Finishing up</h1>
                <p>Double-check everything looks OK before confirming.</p>
            </header>

            <div className={`flex flex-col gap-4 py-4 px-6 bg-muted`}>
                <header className={`grid grid-cols-[1fr_auto] items-center`}>
                    <h2>{plan?.title} ({yearly?"Annually":"Monthly"})</h2>
                    <div className={`row-span-2`}>${plan?.price}/{pricing?.frequency}</div>
                    <div>Change</div>
                </header>
                <hr />
                {snapshot?.context.addOns.online && (
                    <div className={`flex justify-between`}>
                        <span>{online?.title}</span>
                        <span>+${online?.price}/{pricing?.frequency}</span>
                    </div>
                )}
                {snapshot?.context.addOns.customProfile && (
                    <div className={`flex justify-between`}>
                        <span>{profile?.title}</span>
                        <span>+${profile?.price}/{pricing?.frequency}</span>
                    </div>
                )}
                {snapshot?.context.addOns.largerStorage && (
                    <div className={`flex justify-between`}>
                        <span>{storage?.title}</span>
                        <span>+${storage?.price}/{pricing?.frequency}</span>
                    </div>
                )}
            </div>

            <div className={`flex justify-between gap-4 py-4 px-6`}>
                <span>Total (per {yearly?"year":"month"})</span>
                <span>+${total}/{pricing?.frequency}</span>
            </div>
        </div>
    );
}