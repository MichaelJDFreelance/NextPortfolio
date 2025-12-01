import {ReactNode} from "react";
import Check from "@/icons/check.svg"

type PlanInclusionArray = [boolean, boolean, boolean];

export function Tick() {
    return (
       <Check />
    );
}

export function FeatureRow({title, isIncludedArray}:{title:ReactNode, isIncludedArray:PlanInclusionArray}) {
    return (
        <>
            <div role="row" className="grid grid-cols-subgrid col-span-3 md:col-span-4 py-3">
                <div className={`max-md:col-span-3 max-md:pb-4`} role="rowheader">{title}</div>
                <div role="cell" className={`flex flex-col gap-2 md:text-center md:items-center`}>
                    <div className={`md:sr-only opacity-50`}>BASIC</div>
                    {isIncludedArray[0] && <Tick/>}
                </div>
                <div role="cell" className={`flex flex-col gap-2 md:text-center md:items-center`}>
                    <div className={`md:sr-only opacity-50`}>PRO</div>
                    {isIncludedArray[1] && <Tick/>}
                </div>
                <div role="cell" className={`flex flex-col gap-2 md:text-center md:items-center`}>
                    <div className={`md:sr-only opacity-50`}>BUSINESS</div>
                    {isIncludedArray[2] && <Tick/>}
                </div>
            </div>
            <hr className={`col-span-3 md:col-span-4 text-[#DFDFDF]`} />
        </>
    );
}

export function FeatureMatrix({children}:{children?:ReactNode}) {
    return (
        <div role="table" className="w-full text-preset-4 px-7 max-w-[790px]">
            <div role="rowgroup" className={`grid grid-cols-3 md:grid-cols-[auto_1fr_1fr_1fr]`}>
                <div role="row" className="grid grid-cols-subgrid col-span-3 md:col-span-4 pb-6">
                    <div role="columnheader">THE FEATURES</div>
                    <div role="columnheader" className={`max-md:sr-only md:text-center`}>BASIC</div>
                    <div role="columnheader" className={`max-md:sr-only md:text-center`}>PRO</div>
                    <div role="columnheader" className={`max-md:sr-only md:text-center`}>BUSINESS</div>
                </div>
                <hr className={`col-span-3 md:col-span-4 text-[#DFDFDF]`} />
                {children}
            </div>
        </div>
    );
}